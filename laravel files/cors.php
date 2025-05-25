<?php
// config/cors.php
return [
'paths' => [
    'api/*',
    'admin/*',
    'web/*',
    'build/*', 
    'build/assets/*',
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

 'allowed_origins' => ['http://localhost:8081', 'http://192.168.10.40:8000'],
 
    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' =>  true,
];