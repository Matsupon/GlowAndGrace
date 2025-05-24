<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;

class ProductApiController extends Controller
{
    public function allProducts()
    {
        // Eager load type/subtype if you want
        $products = Product::with(['type', 'subtype'])
            ->where(function($query) {
                $query->where('is_admin_created', true)
                      ->orWhere('is_fda_approved', true);
            })
            ->get();

        return response()->json([
            'products' => $products
        ]);
    }
}