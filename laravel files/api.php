// routes/api.php
<?php
use Illuminate\Http\Request;
use App\Http\Controllers\UserController;
use App\Http\Controllers\API\MobileAuthController;
use App\Http\Controllers\API\MobileCartController;
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
});
