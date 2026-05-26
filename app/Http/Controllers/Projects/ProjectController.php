<?php

namespace App\Http\Controllers\Projects;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    /** List the authenticated user's Projects. */
    public function index(Request $request): Response
    {
        $projects = $request->user()
            ->projects()
            ->where('status', Project::STATUS_ACTIVE)
            ->orderByDesc('updated_at')
            ->get(['id', 'name', 'description', 'status', 'updated_at']);

        return Inertia::render('Projects/Index', [
            'projects' => $projects,
        ]);
    }

    /** Show the create Project form. */
    public function create(): Response
    {
        return Inertia::render('Projects/Create');
    }

    /** Store a new Project. */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
        ]);

        $project = $request->user()->projects()->create($validated);

        return redirect()->route('projects.show', $project)
            ->with('success', 'Project created.');
    }

    /** Show a single Project (placeholder dashboard). */
    public function show(Request $request, Project $project): Response|RedirectResponse
    {
        if (! $project->isOwnedBy($request->user())) {
            abort(404);
        }

        return Inertia::render('Projects/Show', [
            'project' => $project->only('id', 'name', 'description', 'status', 'updated_at'),
        ]);
    }

    /** Show the edit Project form. */
    public function edit(Request $request, Project $project): Response
    {
        if (! $project->isOwnedBy($request->user())) {
            abort(404);
        }

        return Inertia::render('Projects/Edit', [
            'project' => $project->only('id', 'name', 'description'),
        ]);
    }

    /** Update a Project. */
    public function update(Request $request, Project $project): RedirectResponse
    {
        if (! $project->isOwnedBy($request->user())) {
            abort(404);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
        ]);

        $project->update($validated);

        return redirect()->route('projects.show', $project)
            ->with('success', 'Project updated.');
    }

    /** Soft-delete a Project. */
    public function destroy(Request $request, Project $project): RedirectResponse
    {
        if (! $project->isOwnedBy($request->user())) {
            abort(404);
        }

        $project->delete();

        return redirect()->route('projects.index')
            ->with('success', 'Project deleted.');
    }
}
