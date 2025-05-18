// routes/api.php
<?php
use Illuminate\Http\Request;
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
    Route::prefix('mobile')->group(function () {
        Route::get('/cart', [MobileCartController::class, 'getCartItems']);
        Route::post('/cart/add', [MobileCartController::class, 'addToCart']);
        Route::delete('/cart/{id}', [MobileCartController::class, 'removeFromCart']);
        Route::get('/cart/count', [MobileCartController::class, 'getCartCount']);
        Route::put('/cart/{id}', [MobileCartController::class, 'updateQuantity']);
    });
});