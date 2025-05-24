<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ApprovedSellerProductController extends Controller
{
    public function index()
    {
        $userId = auth()->id();
        $products = Product::where('user_id', $userId)
            ->where('is_fda_approved', 1)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'description' => $product->description,
                    'price' => $product->price,
                    'image' => $product->image ? asset('storage/' . $product->image) : null,
                ];
            });
        return response()->json($products);
    }
} 