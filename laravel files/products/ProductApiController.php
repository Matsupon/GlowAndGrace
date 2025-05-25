<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;

class ProductApiController extends Controller
{
public function allProducts()
{
    try {
        return Product::with(['type', 'subtype'])
            ->where(function($query) {
                $query->where('is_admin_created', true)
                      ->orWhere('is_fda_approved', true);
            })
            ->get()
            ->map(function ($product) {
                return [
                    ...$product->toArray(),
                    'image_url' => $product->image 
                        ? asset("storage/{$product->image}") 
                        : null
                ];
            });
    } catch (\Exception $e) {
        \Log::error($e);
        return response()->json(['error' => $e->getMessage()], 500);
    }
}

public function uploadProduct(Request $request)
{
    $user = $request->user();

    // Only allow users with 'user' or 'Seller' role
    if (!in_array($user->role, ['user', 'Seller'])) {
        return response()->json(['error' => 'Unauthorized'], 403);
    }

    $validated = $request->validate([
        'ProductName' => 'required|string|max:255',
        'Description' => 'nullable|string',
        'Price' => 'required|numeric|min:0',
        'TypeID' => 'required|integer|exists:producttypes,TypeID',
        'SubTypeID' => 'required|integer|exists:productsubtypes,SubTypeID',
        'image' => 'required|image|mimes:jpg,jpeg,png|max:5120',
        'fda_image' => 'required|image|mimes:jpg,jpeg,png|max:5120',
    ]);

    // Store images
    $imagePath = $request->file('image')->store('products', 'public');
    $fdaImagePath = $request->file('fda_image')->store('fda_approvals', 'public');

    $product = \App\Models\Product::create([
        'name' => $validated['ProductName'],
        'description' => $validated['Description'] ?? null,
        'price' => $validated['Price'],
        'type_id' => $validated['TypeID'],
        'subtype_id' => $validated['SubTypeID'],
        'image' => $imagePath,
        'fda_image' => $fdaImagePath,
        'user_id' => $user->id,
        'is_fda_approved' => false,
    ]);

    // Optionally update user role to PendingSeller if needed
    if ($user->role === 'user') {
        $user->update([
            'role' => 'PendingSeller',
            'seller_status' => true
        ]);
    }

    return response()->json([
        'message' => 'Product uploaded successfully!',
        'product' => $product
    ], 201);
}
}