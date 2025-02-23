<?php

namespace App\Http\Controllers\v1;

use App\Http\Requests\JobGuardUpdateRequest;
use App\Http\Resources\JobResource;
use App\Http\Resources\Pagination\JobPaginatedCollection;
use App\Models\Job;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class JobGuardController  extends Controller
{

    public function index(Request $request)
    {
        Gate::authorize('viewGuard', Job::class);

        $query = Job::query();

        $query->where([
            ['is_check', true],
            ['is_check_enterprise', true]
        ]);

        $now = Carbon::now();

        $query->where(function ($q) use ($now) {
            $q->where(DB::raw("in_datetime"), '>', $now->toDateTimeString());
        });

        $query->where('is_check', true);

        $search = $request->input('search', null);

        if ($search !== null) {
            $query->where('description', 'LIKE', "%{$search}%");
        }

        $jobs = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json(new JobPaginatedCollection($jobs));
    }


    function update(Job $job, JobGuardUpdateRequest $request)
    {
        Gate::authorize('viewGuard', Job::class);

        $data = $request->validated();

        $job->update($data);

        return response()->json([
            'job' => JobResource::make($job)
        ]);
    }
}
