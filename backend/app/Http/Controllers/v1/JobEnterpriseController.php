<?php

namespace App\Http\Controllers\v1;

use App\Events\NotificationSent;
use App\Http\Controllers\Controller;
use App\Http\Requests\JobEnterpriseStoreRequest;
use App\Http\Requests\JobEnterpriseUpdateRequest;
use App\Http\Resources\JobResource;
use App\Http\Resources\Pagination\JobPaginatedCollection;
use App\Models\Enterprise;
use App\Models\Job;
use App\Models\Notification;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class JobEnterpriseController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function index(Enterprise $enterprise, Request $request)
    {
        Gate::authorize('view', $enterprise);

        $query = $enterprise->jobs()->getQuery();

        $now = Carbon::now();

        $query->where(function ($q) use ($now) {
            $q->where(DB::raw("in_datetime"), '>', $now->toDateTimeString());
        });
        
        $confirm = $request->input('confirm');

        if ($confirm === 'true') $query->where('is_check', true);
        else if ($confirm === 'false') $query->where('is_check', false);

        $search = $request->input('search', null);

        if ($search !== null) {
            $query->where('description', 'LIKE', "%{$search}%");
        }

        $jobs = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json(new JobPaginatedCollection($jobs));
    }

    public function show(Enterprise $enterprise, Job $job)
    {
        Gate::authorize('view', $enterprise);
        Gate::authorize('view', $job);

        return response()->json(['job' => JobResource::make($job)]);
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Enterprise $enterprise, JobEnterpriseStoreRequest $request)
    {
        Gate::authorize('view', $enterprise);

        $data =  $request->validated();

        $job = $enterprise->jobs()->create($data);

        $notification = Notification::create([
            'content' => 'La Empresa ' . $enterprise->nombre . ' programo un nuevo trabajo',
            'enterprise_id' => $enterprise->id,
            'job_id' => $job->id
        ]);

        broadcast(new NotificationSent($notification));


        return response()->json(JobResource::make($job), 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Enterprise $enterprise, JobEnterpriseUpdateRequest $request, Job $job)
    {
        Gate::authorize('update', $enterprise);
        Gate::authorize('update', $job);

        $data = $request->validated();

        $job->update($data);

        return response()->json(JobResource::make($job));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Enterprise $enterprise, Job $job)
    {
        Gate::authorize('delete', $enterprise);
        Gate::authorize('delete', $job);

        $job->delete();

        return response()->json();
    }
}
