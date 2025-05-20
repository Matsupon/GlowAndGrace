<?php

namespace App\Models;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasApiTokens, HasFactory;

    protected $fillable = [
        'user_id', 
        'product_id', 
        'delivery_address',
        'quantity',
        'total_amount',
        'payment_method',
        'status',
        'product_name',
        'product_image',
    ];

    protected $with = ['user', 'product']; 

    protected $casts = [
        'quantity' => 'integer',
        'total_amount' => 'decimal:2'
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
}
