<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class MobileAuthController extends Controller
{
    public function login(Request $request)
{
    $validator = Validator::make($request->all(), [
        'email' => 'required|string|email',
        'password' => 'required|string',
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }

    $user = User::where('email', $request->email)->first();

    if (! $user || ! Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    // Convert role to lowercase for comparison
    $normalizedRole = strtolower($user->role);
    
    if (!in_array($normalizedRole, ['admin', 'user', 'seller'])) {
        return response()->json(['message' => 'Unauthorized role'], 403);
    }

    $token = $user->createToken('mobile-token')->plainTextToken; // Create token once

    return response()->json([
        'user' => $user,
        'token' => $token, // Use the created token
        'role' => $normalizedRole,
    ]);
}

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users',
            'email' => 'required|string|email|max:255|unique:users',
            'address' => 'nullable|string|max:255',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:admin,seller,user',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $user = User::create([
                'name' => $request->name,
                'username' => $request->username,
                'email' => $request->email,
                'address' => $request->address,
                'password' => bcrypt($request->password),
                'role' => strtolower($request->role), // Ensure lowercase
                'seller_status' => $request->role === 'seller',
            ]);

            Log::info('New user registered', ['user_id' => $user->id]);

            $token = $user->createToken('mobile-token')->plainTextToken;

            return response()->json([
                'user' => $user->makeHidden(['password', 'remember_token']),
                'token' => $token,
            ], 201);

        } catch (\Exception $e) {
            Log::error('Registration error: ' . $e->getMessage());
            return response()->json(['message' => 'Registration failed'], 500);
        }
    }

    public function profile(Request $request)
    {
        Log::info('Profile accessed', ['user_id' => $request->user()->id]);
        return $request->user()->makeHidden(['password', 'remember_token']);
    }

    // --- ADMIN USER MANAGEMENT API FOR MOBILE/ADMIN PANEL ---
    // GET /api/admin/users
    public function getAllUsers()
    {
        $users = User::all(['id', 'name', 'email', 'role', 'address', 'username']);
        return response()->json($users);
    }

    // POST /api/admin/users
    public function addUser(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'address' => 'nullable|string|max:255',
            'role' => 'required|in:admin,seller,user',
        ]);
        $user = User::create([
            'name' => $validated['name'],
            'username' => $validated['username'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
            'address' => $validated['address'] ?? null,
            'role' => $validated['role'],
            'seller_status' => $validated['role'] === 'seller',
        ]);
        return response()->json($user, 201);
    }

    // PUT /api/admin/users/{id}
    public function updateUser(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username,' . $id,
            'email' => 'required|string|email|max:255|unique:users,email,' . $id,
            'address' => 'nullable|string|max:255',
            'role' => 'required|in:admin,seller,user',
            'password' => 'nullable|string|min:8',
        ]);
        $user->name = $validated['name'];
        $user->username = $validated['username'];
        $user->email = $validated['email'];
        $user->address = $validated['address'] ?? null;
        $user->role = $validated['role'];
        $user->seller_status = $validated['role'] === 'seller';
        if (!empty($validated['password'])) {
            $user->password = bcrypt($validated['password']);
        }
        $user->save();
        return response()->json($user);
    }

    // DELETE /api/admin/users/{id}
public function deleteUser($id)
{
    try {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'User deleted successfully.']);
    } catch (\Exception $e) {
        \Log::error('Failed to delete user: ' . $e->getMessage());
        return response()->json(['error' => 'Failed to delete user.'], 500);
    }
}
 
}
