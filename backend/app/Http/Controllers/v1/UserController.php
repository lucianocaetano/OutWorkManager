<?php

namespace App\Http\Controllers\v1;

use App\Models\User;
use App\Http\Requests\UserStoreRequest;
use App\Http\Requests\UserUpdateRequest;
use App\Http\Controllers\Controller;
use App\Http\Resources\EnterpriseResource;
use App\Http\Resources\Pagination\UsersPaginatedCollection;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $query = User::query();

        if($request->role){
            // not enterprise
            if($request->role === "users_not_enterprise"){
                $query->doesntHave('enterprise');
            }else{

                $query->where("rol", "=", $request->role);
            }

        }

        $search = $request->input('search', null);

        if ($search !== null) {
            $query->where('name', 'LIKE', "%{$search}%");
        }

        $users = $query->paginate(10);
        
        return response()->json(new UsersPaginatedCollection($users), 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UserStoreRequest $request)
    {
        $data = $request->validated();

        $data['password'] = Hash::make($data['password']);

        $user = User::create($data);

        return response()->json(["user" => UserResource::make($user)], 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UserUpdateRequest $request, User $user)
    {
        $data = $request->validated();

        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        $user->update($data);

        return response()->json(["user" => UserResource::make($user)]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();

        return response()->json(null, 204);
    }
}