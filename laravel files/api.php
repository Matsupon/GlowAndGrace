// routes/api.php
<?php
use Illuminate\Http\Request;
use App\Http\Controllers\UserController;
use App\Http\Controllers\API\MobileAuthController;
use App\Http\Controllers\API\MobileCartController; 
use App\Http\Controllers\ProductController; 
use App\Http\Controllers\API\ProductApiController;
use Illuminate\Support\Facades\Route; 


// Auth routes
Route::post('/mobile/login', [MobileAuthController::class, 'login']);
Route::post('/mobile/register', [MobileAuthController::class, 'register']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/mobile/user', function (Request $request) {
        return response()->json($request->user());
    });

    // Cart routes
    Route::get('/mobile/cart', [MobileCartController::class, 'getCartItems']);
    Route::post('/mobile/cart/add', [MobileCartController::class, 'addToCart']);
    Route::delete('/mobile/cart/{id}', [MobileCartController::class, 'removeFromCart']);
    Route::get('/mobile/cart/count', [MobileCartController::class, 'getCartCount']);
    Route::put('/mobile/cart/{id}', [MobileCartController::class, 'updateQuantity']);
    Route::post('/mobile/checkout', [MobileCartController::class, 'checkout']);
    Route::get('/mobile/my-orders', [MobileCartController::class, 'getAllOrders']);
    Route::get('/mobile/orders', [MobileCartController::class, 'getMyOrdered']);

    // Admin routes
    Route::get('/admin/orders', [MobileCartController::class, 'getAllOrders']);

    // Order Details routes
    Route::get('/admin/order-details', [\App\Http\Controllers\OrderDetailsController::class, 'index']);
    Route::post('/admin/order-details', [\App\Http\Controllers\OrderDetailsController::class, 'store']);
    Route::put('/admin/order-details/{id}/status', [\App\Http\Controllers\OrderDetailsController::class, 'updateStatus']);
    Route::get('/mobile/order-details', [\App\Http\Controllers\API\MobileCartController::class, 'getUserOrderDetails']);

    // --- ADMIN USER MANAGEMENT API (for mobile/admin panel) ---
    Route::get('/admin/users', [App\Http\Controllers\API\MobileAuthController::class, 'getAllUsers']);
    Route::post('/admin/users', [App\Http\Controllers\API\MobileAuthController::class, 'addUser']);
    Route::put('/admin/users/{id}', [App\Http\Controllers\API\MobileAuthController::class, 'updateUser']);
    Route::delete('/admin/users/{id}', [App\Http\Controllers\API\MobileAuthController::class, 'deleteUser']);
    // --- END ADMIN USER MANAGEMENT API ---
 
    //product seller and store products
    Route::post('/products/store', [ProductController::class, 'store']);

    Route::get('/pending-sellers-with-products', [ProductController::class, 'fetchPendingSellerProducts']);


    //approve seller 
    Route::post('/users/{id}/approve-seller', [UserController::class, 'approveSeller']);

    //reject seller
    Route::post('/users/{id}/reject-seller', [UserController::class, 'rejectSeller']);

    Route::delete('/products/{product}', [ProductController::class, 'destroy']);
    Route::post('/products/{product}/approve', [ProductController::class, 'approveProduct']);
    Route::get('/seller/products', [ProductController::class, 'getSellerProducts']);
    Route::get('/products/all', [ProductApiController::class, 'allProducts']);
    Route::post('/mobile/products/upload', [\App\Http\Controllers\API\ProductApiController::class, 'uploadProduct']);

    //admin skincare products
    Route::get('/admin/skincare-products', [ProductController::class, 'fetchAdminSkincareProducts']);

    //display seller uploaded products 
    Route::get('/sellers-with-pending-products', [ProductController::class, 'fetchSellersWithPendingProducts']);

    //display admin uploaded products 
    Route::post('/admin/products/store', [ProductController::class, 'storeAdmin']);
});
