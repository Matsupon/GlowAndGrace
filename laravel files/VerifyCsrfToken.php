<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array<int, string>
     */
    protected $except = [
    'test-csrf',
    'api/*',
    'admin/*',
    'web/*',
    'login',
    'logout',
    'register',
    'user',
    'products',
    'fetch',
    'mainpage',
    'mobile/*',
    'products/*',
    'admin/products/store',
    '/api/seller/products',
];
}
