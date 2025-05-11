<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Product;
use App\Models\ProductSubtype;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{
    /**
     * Fetch all products.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $category = $request->query('category');

        $products = Product::when($category, function ($query, $category) {
            return $query->whereHas('subtype', function ($subtypeQuery) use ($category) {
                $subtypeQuery->where('TypeID', $category);
            });
        })->get();

        return response()->json($products);
    }

    /**
     * Store a newly created product.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        try {
            \Log::info('Product upload request received:', $request->all());
            
            // Validate incoming data
            $validated = $request->validate([
                'ProductName' => 'required|string',
                'Description' => 'nullable|string',
                'Price' => 'required|numeric',
                'TypeID' => 'required|integer',
                'SubTypeID' => 'required|integer',
                'image' => 'required|image|mimes:jpg,jpeg,png|max:2048',
                'fda_image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            ]);

            \Log::info('Validation passed');

            $isAdminCreated = (Auth::user()->role === 'admin') ? 1 : 0;

            // Handle product image upload
            $imagePath = null;
            if ($request->hasFile('image')) {
                \Log::info('Processing product image upload');
                $image = $request->file('image');
                $imageName = time() . '_' . $image->getClientOriginalName();
                $imagePath = $image->storeAs('products', $imageName, 'public');
                \Log::info('Product image stored at: ' . $imagePath);
            } else {
                \Log::error('No product image found in request');
                throw new \Exception('Product image is required');
            }

            // Handle FDA image upload
            $fdaImagePath = null;
            if ($request->hasFile('fda_image')) {
                \Log::info('Processing FDA image upload');
                $fdaImage = $request->file('fda_image');
                $fdaImageName = time() . '_' . $fdaImage->getClientOriginalName();
                $fdaImagePath = $fdaImage->storeAs('fda_images', $fdaImageName, 'public');
                \Log::info('FDA image stored at: ' . $fdaImagePath);
            }

            \Log::info('Creating product record');
            $product = Product::create([
                'name' => $validated['ProductName'],
                'description' => $validated['Description'] ?? null,
                'price' => $validated['Price'],
                'type_id' => $validated['TypeID'],
                'subtype_id' => $validated['SubTypeID'],
                'image' => $imagePath,
                'fda_image' => $fdaImagePath,
                'user_id' => Auth::id(),
                'is_admin_created' => $isAdminCreated,
                'is_fda_approved' => $isAdminCreated,
            ]);

            \Log::info('Product created successfully', ['product_id' => $product->id]);

            $user = Auth::user();
            if ($user->role === 'user') {
                $user->role = 'PendingSeller';
                $user->seller_status = true;
                $user->save();
                \Log::info('User role updated to PendingSeller');
            }

            return response()->json([
                'message' => 'Product created successfully!',
                'product' => $product
            ], 201);

        } catch (\Exception $e) {
            \Log::error('Product creation failed:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all(),
                'files' => $request->allFiles()
            ]);
            
            return response()->json([
                'error' => 'Product creation failed',
                'message' => $e->getMessage()
            ], 500);
        }
    }


    public function destroy($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }

        $product->delete();

        return response()->json(['message' => 'Product deleted successfully'], 200);
    }

    public function getProductsBySubtype($subtypeId)
    {
        $products = Product::where('subtype_id', $subtypeId)->get();

        return response()->json(
            $products->map(function ($product) {
                return [
                    'id' => $product->id, // Primary ID is now being used
                    'name' => $product->name,
                    'description' => $product->description,
                    'price' => $product->price,
                    'image' => $product->image,
                ];
            })
        );
    }



    /**
     * Get all products (for admin view).
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getProducts(Request $request)
    {
        $category = $request->query('category');
        $products = Product::when($category, function ($query, $category) {
            return $query->whereHas('subtype', function ($subtypeQuery) use ($category) {
                $subtypeQuery->where('TypeID', $category); // Filter by TypeID
            });
        })->get();

        return response()->json($products);
    }

    /**
     * Fetch subtypes for a given TypeID.
     *
     * @param int $typeId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getSubtypes($typeId)
    {
        $subtypes = ProductSubtype::where('TypeID', $typeId)->get(['SubTypeID as id', 'SubTypeName as name']);
        return response()->json($subtypes);
    }


    public function show($id)
    {
        $product = Product::findOrFail($id);
        return response()->json([
            'id' => $product->id,
            'name' => $product->name,
            'description' => $product->description,
            'price' => $product->price,
            'image' => $product->image ? asset('storage/' . $product->image) : null,
            'is_favorited' => $product->favoritedBy()->where('user_id', auth()->id())->exists()
        ]);
    }

    public function edit($id)
    {
        return Inertia::render('Admin/AddProducts/EditProduct', [
            'productId' => (int) $id,
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $product = Product::findOrFail($id);
        
        // Update basic information
        $product->name = $request->name;
        $product->price = $request->price;
        $product->description = $request->description;

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if it exists
            if ($product->image) {
                \Storage::disk('public')->delete($product->image);
            }
            $product->image = $request->file('image')->store('products', 'public');
        }

        $product->save();

        return response()->json([
            'message' => 'Product updated successfully!',
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'description' => $product->description,
                'price' => $product->price,
                'image' => $product->image ? asset('storage/' . $product->image) : null,
            ]
        ]);
    }




    /**
     * Fetch 5 products for each product type for the MainPage.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getMainPageProducts()
    {
        $skincareProducts = Product::where('type_id', 1)->take(5)->get()->map(function ($product) {
            $product->image_url = $product->image ? asset('storage/' . $product->image) : null;
            return $product;
        });

        $haircareProducts = Product::where('type_id', 2)->take(5)->get()->map(function ($product) {
            $product->image_url = $product->image ? asset('storage/' . $product->image) : null;
            return $product;
        });

        $makeupProducts = Product::where('type_id', 3)->take(5)->get()->map(function ($product) {
            $product->image_url = $product->image ? asset('storage/' . $product->image) : null;
            return $product;
        });

        return response()->json([
            'skincareProducts' => $skincareProducts,
            'haircareProducts' => $haircareProducts,
            'makeupProducts' => $makeupProducts,
        ]);
    }

    public function getImageUrlAttribute()
    {
        return $this->image ? asset('storage/products' . $this->image) : null;
    }


    public function getProductsByType(Request $request)
    {
        $typeId = $request->query('type_id');

        if (!in_array($typeId, [1, 2, 3])) {
            return response()->json(['error' => 'Invalid product type ID.'], 400);
        }

        $products = Product::where('type_id', $typeId)
            ->where(function ($query) {
                $query->where('is_admin_created', true)
                    ->orWhereHas('user', function ($userQuery) {
                        $userQuery->where('role', 'Seller');
                    });
            })
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'description' => $product->description,
                    'price' => $product->price,
                    'image' => $product->image ? asset('storage/' . $product->image) : null,
                    'type_id' => $product->type_id,
                    'subtype_id' => $product->subtype_id,
                    'is_admin_created' => $product->is_admin_created,
                    'is_fda_approved' => $product->is_fda_approved,
                ];
            });

        return response()->json($products);
    }


    public function fetchProductsBySubtype(Request $request)
    {
        $subtypeId = $request->query('subtype_id');

        if (!$subtypeId) {
            return response()->json(['error' => 'subtype_id is required.'], 400);
        }

        $products = Product::where('subtype_id', $subtypeId)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'description' => $product->description,
                    'price' => $product->price,
                    'image' => $product->image ? asset('storage/' . $product->image) : '/path/to/default-image.jpg',
                ];
            });

        return response()->json($products);
    }


    public function fetchProducts(Request $request)
    {
        $user = auth()->user(); // Get the authenticated user

        // Fetch all products with eager loading for favorites to avoid N+1 issues
        $products = Product::with(['favoritedBy' => function ($query) use ($user) {
            $query->where('user_id', $user ? $user->id : null);
        }])->get();

        // Map the products with favorited status
        $mappedProducts = $products->map(function ($product) use ($user) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'description' => $product->description,
                'price' => $product->price,
                'image' => $product->image ? asset('storage/' . $product->image) : null,
                'is_favorited' => $user ? $product->favoritedBy->isNotEmpty() : false, // Check if the product is favorited by the user
            ];
        });

        return response()->json([
            'products' => $mappedProducts,
            'favoritesCount' => $user ? $user->favorites()->count() : 0, // Count the total number of favorites for the user
        ]);
    }



    public function fetchFDAProducts(Request $request)
    {
        $subtypeId = $request->query('subtype_id');

        $products = Product::when($subtypeId, function ($query, $subtypeId) {
            $query->where('subtype_id', $subtypeId);
        })
            ->where(function ($query) {
                $query->where('is_fda_approved', 1)
                    ->orWhere('is_admin_created', 1);
            })
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'description' => $product->description,
                    'price' => $product->price,
                    'image_url' => $product->image ? asset('storage/' . $product->image) : null,
                ];
            });

        return response()->json($products);
    }





    public function fetchPendingProducts()
    {
        // Fetch all products that are not FDA approved yet
        $pendingProducts = Product::where('is_fda_approved', false)
            ->whereNotNull('user_id')
            ->with('user') // Add the user relationship
            ->get()->map(function ($product) {
                return [
                    'id' => $product->id,
                    'seller_name' => $product->user->name ?? 'Unknown Seller',
                    'name' => $product->name,
                    'price' => $product->price,
                    'description' => $product->description,
                    'image_url' => $product->image ? asset('storage/' . $product->image) : null,
                    'fda_image_url' => $product->fda_image ? asset('storage/' . $product->fda_image) : null,
                ];
            });

        return response()->json($pendingProducts);
    }

    public function approveProduct($id)
    {
        $product = Product::findOrFail($id);
        $product->is_fda_approved = true; // Mark product as approved
        $product->save();

        $user = $product->user;
        if ($user && $user->role === 'PendingSeller') {
            $user->role = 'Seller';
            $user->save();
        }

        return response()->json(['message' => 'Product approved successfully!']);
    }


    public function fetchPendingSellerProducts()
    {
        $products = Product::where('is_fda_approved', false)
            ->whereHas('user', function ($query) {
                $query->where('role', 'Seller'); // Only fetch products uploaded by Sellers
            })
            ->with('user') // Load user details
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'seller_name' => $product->user->name ?? 'Unknown Seller',
                    'name' => $product->name,
                    'price' => $product->price,
                    'description' => $product->description,
                    'image_url' => $product->image ? asset('storage/' . $product->image) : null,
                    'fda_image_url' => $product->fda_image ? asset('storage/' . $product->fda_image) : null,
                ];
            });

        return response()->json($products);
    }




    public function fetchPendingCustomerProducts()
    {
        $customerProducts = Product::where('is_fda_approved', false)
            ->whereHas('user', function ($query) {
                $query->where('role', 'Customer');
            })
            ->with('user')
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'customer_name' => $product->user->name ?? 'Unknown Customer',
                    'name' => $product->name,
                    'price' => $product->price,
                    'description' => $product->description,
                    'image_url' => $product->image ? asset('storage/' . $product->image) : null,
                    'fda_image_url' => $product->fda_image ? asset('storage/' . $product->fda_image) : null,
                ];
            });

        return response()->json($customerProducts);
    }

    public function getSellerProducts()
    {
        $userId = auth()->id();
        
        $products = Product::where('user_id', $userId)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'description' => $product->description,
                    'price' => $product->price,
                    'image' => $product->image ? asset('storage/' . $product->image) : null,
                    'is_fda_approved' => $product->is_fda_approved,
                ];
            });

        return response()->json($products);
    }

    public function getCounts()
    {
        try {
            \Log::info('Starting product counts');
            
            // Count products by type using type_id directly
            $skincare = Product::where('type_id', 1)->count(); // TypeID 1 is Skincare
            $haircare = Product::where('type_id', 2)->count(); // TypeID 2 is Haircare
            $makeup = Product::where('type_id', 3)->count();   // TypeID 3 is Makeup
            $pending = Product::where('is_fda_approved', false)->count();

            $counts = [
                'skincare' => $skincare,
                'haircare' => $haircare,
                'makeup' => $makeup,
                'pending' => $pending
            ];

            \Log::info('Product counts:', $counts);
            
            return response()->json($counts);
        } catch (\Exception $e) {
            \Log::error('Error in ProductController@getCounts: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            
            if (config('app.debug')) {
                return response()->json([
                    'error' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getLine()
                ], 500);
            }
            
            return response()->json(['error' => 'Failed to fetch product counts'], 500);
        }
    }
    

    /**
     * Get detailed product information for the product details page.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getProductDetails($id)
    {
        try {
            $product = Product::with(['subtype.type'])
                ->findOrFail($id);

            // Get related products from the same subtype
            $relatedProducts = Product::where('subtype_id', $product->subtype_id)
                ->where('id', '!=', $product->id)
                ->take(4)
                ->get()
                ->map(function ($relatedProduct) {
                    return [
                        'id' => $relatedProduct->id,
                        'name' => $relatedProduct->name,
                        'price' => $relatedProduct->price,
                        'image' => $relatedProduct->image ? asset('storage/' . $relatedProduct->image) : null,
                    ];
                });

            return response()->json([
                'id' => $product->id,
                'name' => $product->name,
                'description' => $product->description,
                'price' => $product->price,
                'image' => $product->image ? asset('storage/' . $product->image) : null,
                'subtype' => [
                    'id' => $product->subtype->SubType
                ],
                'type' => [
                    'id' => $product->subtype->type->TypeID,
                    'name' => $product->subtype->type->TypeName,
                ],
                'is_favorited' => $product->favoritedBy()->where('user_id', auth()->id())->exists(),
                'related_products' => $relatedProducts
            ]);
        } catch (\Exception $e) {
            \Log::error('Error in ProductController@getProductDetails: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            
            if (config('app.debug')) {
                return response()->json([
                    'error' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getLine()
                ], 500);
            }
            
            return response()->json(['error' => 'Failed to fetch product details'], 500);
        }
    }





}
