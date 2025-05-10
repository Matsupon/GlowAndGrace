<?php
namespace App\Http\Controllers;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;


class UserController extends Controller
{
    public function index()
    {
        $users = User::all(['id', 'name', 'email', 'role', 'seller_status', 'address', 'username']);
        return Inertia::render('Admin/Users/User', [
            'users' => $users,
        ]);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return redirect()->back()->with('success', 'User deleted successfully');
    }

    public function store(Request $request)
    {
        // Validate the request data
        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'address' => 'nullable|string|max:255',
            'role' => 'required|in:admin,seller,user',
        ]);

        try {
            User::create([
                'name' => $request->name,
                'username' => $request->username,
                'email' => $request->email,
                'password' => bcrypt($request->password),
                'address' => $request->address,
                'role' => $request->role,
                'seller_status' => $request->role === 'seller',
            ]);

            // Redirect back to the users list with a success message
            return redirect()->route('users.index')->with('success', 'User added successfully');
        } catch (\Exception $e) {
            // Handle any errors and redirect back with an error message
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function show($id)
    {
        $user = User::findOrFail($id); // Fetch user or throw a 404
        return response()->json($user); // Return user data as JSON
    }


    public function update(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'username' => 'required|string|max:255',
                'address' => 'nullable|string|max:255',
                'email' => 'required|email|unique:users,email,' . $id,
                'password' => 'nullable|string|min:8',
                'role' => 'required|string|in:admin,Seller,PendingSeller,user', // Validate role
            ]);

            $user = User::findOrFail($id);

            $user->name = $validated['name'];
            $user->username = $validated['username'];
            $user->address = $validated['address'];
            $user->email = $validated['email'];
            $user->role = $validated['role']; // Update the role
            $user->seller_status = ($validated['role'] === 'Seller'); // Update seller_status dynamically

            if (!empty($validated['password'])) {
                $user->password = bcrypt($validated['password']);
            }

            $user->save();

            return redirect()->route('users.index')->with('success', 'User updated successfully!');
        } catch (\Exception $e) {
            Log::error('Failed to update user:', ['error' => $e->getMessage()]);
            return back()->withErrors(['error' => 'Failed to update user. Please try again.']);
        }
    }


    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:8',
        ]);

        if (!Hash::check($request->current_password, auth()->user()->password)) {
            return back()->withErrors(['current_password' => 'Current password is incorrect']);
        }

        $user = auth()->user();
        $user->password = bcrypt($request->new_password);
        $user->save();

        return back()->with('success', 'Password changed successfully.');
    }

    public function updateProfile(Request $request)
    {
        $user = auth()->user();

        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username,' . $user->id,
            'email' => 'required|email|unique:users,email,' . $user->id,
            'address' => 'nullable|string|max:255',
        ]);

        $user->update($validatedData);

        return redirect()->back()->with('success', 'Profile updated successfully.');
    }


    public function showSellerProfile()
    {
        $user = Auth::user(); // Get the currently authenticated user
        return Inertia::render('Account/user/SellerProfile', [
            'user' => $user, // Pass the user as a prop to the component
        ]);
    }





//ADMIN DASHBOARD
   // FOR REMOVING SELLER STATUS TO CUSTOMER
    public function demoteSeller($userId)
    {
        try {
            $user = User::findOrFail($userId);

            // Change the role back to "Customer"
            $user->role = 'user';
            $user->save();

            return response()->json(['message' => 'User role changed back to Customer successfully!']);
        } catch (\Exception $e) {
            Log::error('Failed to demote user:', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to demote user.'], 500);
        }
    }


    public function fetchSellerHistory($userId)
    {
        try {
            \Log::info('Fetching history for user: ' . $userId);

            $products = Product::where('user_id', $userId)
                ->where('is_fda_approved', 1) // Only FDA-approved products
                ->get(['id', 'name', 'image', 'price', 'description']);

            \Log::info('Fetched products for user ' . $userId, ['products' => $products]);

            return response()->json($products);
        } catch (\Exception $e) {
            \Log::error('Failed to fetch seller history:', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to fetch seller history.'], 500);
        }
    }



    public function fetchApprovedSellers()
    {
        $approvedSellers = Product::where('is_fda_approved', 1)
        ->whereHas('user', function ($query) {
            $query->where('role', 'Seller');
        })
            ->with('user')
            ->get()
            ->pluck('user')
            ->unique('id')
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'role' => $user->role,
                ];
            });

        return response()->json($approvedSellers);
    }

    public function getUserAddress()
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        return response()->json([
            'name' => $user->name,
            'address' => $user->address ?? 'No address set'
        ]);
    }

    public function getCounts()
    {
        try {
            return response()->json([
                'count' => User::where('role', 'user')->count(),
            ]);
        } catch (\Exception $e) {
            \Log::error('Error in UserController@getCounts: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function getSellerCounts()
    {
        try {
            return response()->json([
                'approved' => User::where('role', 'Seller')->count(),
                'pending' => User::where('role', 'PendingSeller')->count(),
            ]);
        } catch (\Exception $e) {
            \Log::error('Error in UserController@getSellerCounts: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

}
