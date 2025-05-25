<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'description',
        'price',
        'subtype_id',
        'type_id',
        'category',
        'image',
        'fda_image',
        'user_id',
        'is_admin_created',
        'is_fda_approved',
    ];

    /**
     * Define the relationship with the ProductSubtype model.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
  public function type() {
      return $this->belongsTo(\App\Models\ProductType::class, 'TypeID');
  }
  public function subtype() {
      return $this->belongsTo(\App\Models\ProductSubtype::class, 'SubTypeID');
  }


    /**
     * Define the relationship with the User model (Seller).
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function favoritedBy()
    {
        return $this->belongsToMany(User::class, 'user_favorites')->withTimestamps();
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

}

