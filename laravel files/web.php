<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

require base_path('routes/admin.php');

Route::get('/test-img', function() {
    $path = storage_path('app/public/products/H4gVWSB3HW0cTUuMhSTbVE9j6TmPOrFZkj0w2Dl3.png');
    if (!file_exists($path)) abort(404);
    return response()->file($path);
});

Route::get('/storage/products/{filename}', function ($filename) {
    return response()->file(storage_path("app/public/products/{$filename}"));
});

Route::get('/', function () {
    return Inertia::render('HomePage/HomePage', [
        'canLogin' => Route::has('loginpage'),
        'canRegister' => Route::has('signuppage'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('home');

Route::get('/dashboard', function () {
    return Inertia::render('MainPage/MainPage');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';


Route::get('/loginpage', function () {
    return Inertia::render('HomePage/LoginPage', []);
})->name('loginpage');
// Logout route
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth')
    ->name('logout');

// Login route



// Register route
Route::get('/signuppage', function () {
    return Inertia::render('HomePage/SignupPage');
})->name('signuppage');





// HOMEPAGE

Route::get('/about', function () {
    return Inertia::render('HomePage/AboutPage');
})->name('about');

Route::get('/contact', function () {
    return Inertia::render('HomePage/ContactUsPage');
})->name('contact');







// MAINPAGE
Route::get('/mainpage', function () {
    return Inertia::render('MainPage/MainPage');
})->name('mainpage');


//DISPLAY PRODUCTS FOR MAINPAGE
Route::get('/mainpage/products', [ProductController::class, 'getMainPageProducts']);

// Existing Product Routes
Route::get('/api/products', [ProductController::class, 'getProductsByType'])->middleware('auth');
Route::get('/api/fetch', [ProductController::class, 'fetchProducts']);



//FAVORITES ROUTE
Route::get('/favorites', function () {
    return Inertia::render('Favorites/FavoritesPage');
})->name('favorites');

Route::post('/api/favorites/toggle', [FavoriteController::class, 'toggle'])->middleware('auth');

Route::get('/api/favorites/count', [FavoriteController::class, 'getFavoritesCount'])->middleware('auth');
Route::get('/favorites/count', [FavoriteController::class, 'getFavoritesCount'])->middleware('auth:sanctum');
Route::post('/favorites/toggle', [FavoriteController::class, 'toggle'])->middleware('auth:sanctum');
Route::get('/api/favorites', [FavoriteController::class, 'getUserFavorites'])->middleware('auth');

//Display Favorite Product in DropDown
Route::get('/api/favorite-products', [FavoriteController::class, 'getFavoriteProducts'])->middleware('auth');
Route::get('/favorites/heart', [FavoriteController::class, 'getHeartFavorites']);






//USER LINKS

Route::get('/user', function () {
    return Inertia::render('Account/user/UserPage', [
        'user' => auth()->user(),
    ]);
})->name('user');

Route::post('/change-password', [UserController::class, 'changePassword'])->name('password.change');

Route::post('/update-profile', [UserController::class, 'updateProfile'])->name('profile.update');

Route::get('/usercreate', function () {
    return Inertia::render('Account/seller/UserCreate');
})->name('usercreate');



//SELLER LINKS
Route::get('/sellerprofile', function () {
    return Inertia::render('Account/user/SellerProfile');
})->name('sellerprofile');

Route::get('/sellerprofile', [UserController::class, 'showSellerProfile'])->middleware('auth');

Route::get('/sellercreate', function () {
    return Inertia::render('Account/seller/SellerCreate');
})->name('sellercreate');

Route::get('/sellerproduct', function () {
    return Inertia::render('Account/seller/SellerProduct');
})->name('sellerproduct');

Route::get('/api/seller/products', [ProductController::class, 'getSellerProducts'])->middleware('auth');



//CARTS ROUTES
Route::get('/carts', function () {
    return Inertia::render('Checkout/CartsPage');
})->name('carts');

Route::middleware('auth')->group(function () {
    Route::get('/api/cart', [OrderController::class, 'index']);
    Route::post('/api/cart/add', [OrderController::class, 'add']);
    Route::delete('/api/cart/{id}', [OrderController::class, 'remove']);
    Route::get('/api/cart/count', [OrderController::class, 'count']);
    Route::post('/api/cart/update-quantity', [OrderController::class, 'updateQuantity']);
    Route::post('/cart/checkout', [OrderController::class, 'checkout']);
});

Route::post('/cart/prepare-order', [OrderController::class, 'prepareOrder'])->name('cart.prepare-order')->middleware('auth');







//ORDERS  ROUTES
Route::get('/order', [OrderController::class, 'show'])->name('order.show');

Route::middleware('auth')->group(function () {
    Route::get('/api/user/address', [UserController::class, 'getUserAddress']);
});







//ORDER DETAILS
Route::get('/details', function () {
    return Inertia::render('Checkout/Details');
})->name('details');







//PRODUCT DETAILS ROUTES
Route::middleware(['auth'])->group(function () {
    Route::get('/product-details/{id}', function ($id) {
        return Inertia::render('Products/SkincareProductPage', [
            'productId' => $id
        ]);
    })->name('products.details');

    Route::get('/api/product-details/{id}', [ProductController::class, 'getProductDetails']);
});


//FETCH PRODUCT SUBTYPE IMAGES
Route::get('/api/fetch', [ProductController::class, 'fetchProductsBySubtype']);

//SKINCARE ROUTES
Route::prefix('skincare')->group(function () {
    Route::get('/', function () {
        return Inertia::render('MainPage/Skincare/SkincarePage');
    })->name('skincare.index');

    Route::get('/toner', function () {
        return Inertia::render('MainPage/Skincare/Toner', [
            'subtype_id' => 4,
        ]);
    })->name('skincare.toner');

    Route::get('/moisturizer', function () {
        return Inertia::render('MainPage/Skincare/Moisturizer', [
            'subtype_id' => 2,
        ]);
    })->name('skincare.moisturizer');

    Route::get('/cream', function () {
        return Inertia::render('MainPage/Skincare/Cream', [
            'subtype_id' => 1,
        ]);
    })->name('skincare.cream');

    Route::get('/sunscreen', function () {
        return Inertia::render('MainPage/Skincare/Sunscreen', [
            'subtype_id' => 3,
        ]);
    })->name('skincare.sunscreen');
});



//MAKEUP ROUTES
Route::prefix('makeup')->group(function () {
    Route::get('/', function () {
        return Inertia::render('MainPage/Makeup/MakeupPage');
    })->name('makeup.index');

    Route::get('/foundations', function () {
        return Inertia::render('MainPage/Makeup/Foundations', [
            'subtype_id' => 11,
        ]);
    })->name('makeup.foundations');

    Route::get('/concealers', function () {
        return Inertia::render('MainPage/Makeup/Concealers', [
            'subtype_id' => 10,
        ]);
    })->name('makeup.concealers');

    Route::get('/blushes', function () {
        return Inertia::render('MainPage/Makeup/Blushes', [
            'subtype_id' => 9,
        ]);
    })->name('makeup.blushes');

    Route::get('/lip-tints', function () {
        return Inertia::render('MainPage/Makeup/LipTints', [
            'subtype_id' => 12,
        ]);
    })->name('makeup.lip-tints');
});



// HAIRCARE LISTS
Route::prefix('haircare')->group(function () {
    Route::get('/', function () {
        return Inertia::render('MainPage/Haircare/HaircarePage');
    })->name('haircare.index');

    Route::get('/shampoo', function () {
        return Inertia::render('MainPage/Haircare/Shampoo', [
            'subtype_id' => 8,
        ]);
    })->name('haircare.shampoo');

    Route::get('/conditioner', function () {
        return Inertia::render('MainPage/Haircare/Conditioner', [
            'subtype_id' => 5,
        ]);
    })->name('haircare.conditioner');

    Route::get('/dry-shampoo', function () {
        return Inertia::render('MainPage/Haircare/DryShampoo', [
            'subtype_id' => 6,
        ]);
    })->name('haircare.dry-shampoo');

    Route::get('/hairspray', function () {
        return Inertia::render('MainPage/Haircare/Hairspray', [
            'subtype_id' => 7,
        ]);
    })->name('haircare.hairspray');
});

