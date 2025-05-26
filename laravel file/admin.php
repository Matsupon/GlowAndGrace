<?php

use App\Http\Controllers\Auth\AdminAuthenticatedSessionController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\OrderDetailsController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


//LOGIN FORM
Route::get('/adminlogin', function () {
    return inertia('Admin/AdminLogin');
})->name('admin.login');

Route::post('/adminlogin', [AdminAuthenticatedSessionController::class, 'store'])->name('admin.login.store');


//LOGOUT
Route::post('/adminlogout', [AdminAuthenticatedSessionController::class, 'destroy'])->name('admin.logout');

require __DIR__.'/auth.php';

//ADMIN DASHBOARD
Route::get('/admindashboard', function () {
    if (auth()->check() && auth()->user()->role === 'admin') {
        return inertia('Admin/Dashboard');
    }

    // Redirect to admin login if not an admin
    return redirect()->route('admin.login')->withErrors(['access' => 'Unauthorized access']);
})->name('admin.dashboard');

//DASHBOARD COUNTS
Route::prefix('admin')->group(function () {
    Route::get('/users/count', [UserController::class, 'getCounts']);
    Route::get('/products/count', [ProductController::class, 'getCounts']);
    Route::get('/sellers/count', [UserController::class, 'getSellerCounts']);
    Route::get('/orders/count', [OrderController::class, 'getCounts']);
});




//ADMIN NAME HANDLING
Route::get('/api/admin-profile', function () {
    if (auth()->check() && auth()->user()->role === 'admin') {
        return response()->json(['name' => auth()->user()->name]);
    }

    return response()->json(['error' => 'Unauthorized'], 403);
});






// USER LIST
Route::get('/users', [UserController::class, 'index']);


//EDIT USERS
Route::get('/edit-users/{id}', function ($id) {
    return Inertia::render('Admin/Users/Edit-User', [
        'userId' => $id,
    ]);
});

Route::get('/api/users/{id}', [UserController::class, 'show']);
Route::put('/users/{id}', [UserController::class, 'update'])->name('users.update');


//ADD USERS
Route::get('/add-users', function () {
    return inertia('Admin/Users/Add-User');
});

Route::get('/users', [UserController::class, 'index'])->name('users.index');
Route::post('/users', [UserController::class, 'store'])->name('users.store');


//DELETE USERS
Route::delete('/users/{id}', [UserController::class, 'destroy'])->name('users.destroy');




//PENDING SELLERS LIST
Route::get('/sellers', function () {
    $products = \App\Models\Product::where('is_fda_approved', false)
        ->whereHas('user', function ($query) {
            $query->where('role', 'PendingSeller'); // Now matches corrected role
        })
        ->with('user')
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

    return inertia('Admin/Sellers/Sellers', [
        'products' => $products,
    ]);
});





Route::middleware(['auth'])->group(function () {
    Route::post('/admin/products/store', [ProductController::class, 'store']);
    Route::get('/admin/products/pending', [ProductController::class, 'fetchPendingProducts']);
    Route::get('/admin/products/pending-customers', [ProductController::class, 'fetchPendingCustomerProducts']);
});

Route::middleware(['auth', 'web'])->group(function () {
    Route::patch('/admin/products/{id}/approve', [ProductController::class, 'approveProduct']);
});


//DELETE OR REJECT PENDING SELLERS
Route::delete('/products/delete/{id}', [ProductController::class, 'destroy']);



//SELLERS LIST
Route::get('/approvedsellers', function () {
    return inertia('Admin/Sellers/ApprovedSellers');
});

Route::get('/admin/sellers/approved', [UserController::class, 'fetchApprovedSellers']);

//Remove seller status and change to customer
Route::patch('/admin/users/{userId}/demote', [UserController::class, 'demoteSeller']);


//SELLER HISTORY
Route::get('/historylist/{userId}', function ($userId) {
    return inertia('Admin/Sellers/HistoryList', ['userId' => $userId]);
});

//FETCH SELLER USER HISTORY
Route::get('/api/sellers/{userId}/history', [UserController::class, 'fetchSellerHistory']);





//PENDING PRODUCTS
Route::get('/pendingproducts', function () {
    return inertia('Admin/PendingProducts');
});

Route::get('/admin/products/pending-sellers', [ProductController::class, 'fetchPendingSellerProducts']);

//PRODUCT UPLOAD
Route::get('/products', [ProductController::class, 'index']);
Route::post('/admin/products/store', [ProductController::class, 'store'])->name('products.store');
Route::get('/api/products', [ProductController::class, 'index']);
Route::get('/products', [ProductController::class, 'getProducts']);
Route::get('/api/subtypes/{typeId}', [ProductController::class, 'getSubtypes']);


//DISPLAY PRODUCTS
Route::get('/api/products/subtype/{subtypeId}', [ProductController::class, 'getProductsBySubtype']);

Route::get('/products/{subtypeName}', function ($subtypeName) {
    return inertia('Admin/Products/Show', [
        'subtypeName' => $subtypeName,
    ]);
});

Route::get('/api/products/fda-products', [ProductController::class, 'fetchFDAProducts']);



//DELETE PRODUCTS
Route::delete('/products/{id}', [ProductController::class, 'destroy']);


//EDIT PRODUCTS
Route::get('/products/{id}/edit', [ProductController::class, 'edit'])->name('products.edit');
Route::get('/api/products/{id}', [ProductController::class, 'show']);
Route::post('/api/products/{id}/update', [ProductController::class, 'update']);


//ADD PRODUCTS
Route::get('/add-products', function () {
    return inertia('Admin/AddProducts/AddProducts');
});





//ORDERS
Route::get('/orders', function () {
    return inertia('Admin/Orders/Orders');
});

Route::get('/api/admin/orders', [OrderController::class, 'getAllOrders']);
Route::put('/api/admin/orders/{order}/status', [OrderController::class, 'updateOrderStatus']);
Route::delete('/api/admin/orders/{order}', [OrderController::class, 'destroyOrder']);



//ORDER DETAILS
Route::middleware(['auth'])->group(function () {
    // View route
    Route::get('/order-details/{id}', function ($id) {
        if (auth()->user()->role !== 'admin') {
            return redirect()->route('admin.login')->withErrors(['access' => 'Unauthorized access']);
        }
        return Inertia::render('Admin/Orders/OrderDetails', ['orderId' => $id]);
    })->name('admin.orders.details');

    // API Routes for Order Details
    Route::prefix('api')->group(function () {
        // Get order details for a specific order
        Route::get('/orders/{id}/details', [OrderDetailsController::class, 'getDetails']);

        // Update status of an order detail
        Route::put('/order-details/{id}/status', [OrderDetailsController::class, 'updateStatus']);

        // Update description of an order detail
        Route::put('/order-details/{id}/description', [OrderDetailsController::class, 'updateDescription']);

        // Delete an order detail
        Route::delete('/order-details/{id}', [OrderDetailsController::class, 'destroy']);
    });
});




//SKINCARE

//TONERS
Route::get('/toners', function () {
    return inertia('Admin/Skincare/Toners');
});

//MOISTURIZER
Route::get('/moisturizer', function () {
    return inertia('Admin/Skincare/Moisturizer');
});

//CREAM
Route::get('/cream', function () {
    return inertia('Admin/Skincare/Cream');
});

//SUNSCREEN
Route::get('/sunscreen', function () {
    return inertia('Admin/Skincare/Sunscreen');
});



//HAIRCARE

//SHAMPOO
Route::get('/shampoo', function () {
    return inertia('Admin/Haircare/Shampoo');
});

//CONDITIONER
Route::get('/conditioner', function () {
    return inertia('Admin/Haircare/Conditioner');
});

//DRY SHAMPOO
Route::get('/dry-shampoo', function () {
    return inertia('Admin/Haircare/DryShampoo');
});

//HAIRSPRAY
Route::get('/hairspray', function () {
    return inertia('Admin/Haircare/Hairspray');
});




// MAKEUP

//FOUNDATIONS
Route::get('/foundations', function () {
    return inertia('Admin/Makeup/Foundations');
});

//CONCEALERS
Route::get('/concealers', function () {
    return inertia('Admin/Makeup/Concealers');
});

//BLUSHES
Route::get('/blushes', function () {
    return inertia('Admin/Makeup/Blushes');
});

//LIP TINTS
Route::get('/lip-tints', function () {
    return inertia('Admin/Makeup/LipTints');
});

