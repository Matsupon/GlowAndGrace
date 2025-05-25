<?php
// config/cors.php
return [
'paths' => [
    'api/*',
    'admin/*',
    'web/*',
    'build/*', 
    'mainpage/*',
    'storage/*',
    'products/*',
    'login',
    'logout',
    'register',
    'user',
    'sanctum/csrf-cookie',
    'products',
    'fetch', 
    '/api/seller/products',
    '*',
    'api/mobile/login',
],
    'allowed_methods' => ['*'],

 'allowed_origins' => ['*'],
 
    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' =>  false,
];