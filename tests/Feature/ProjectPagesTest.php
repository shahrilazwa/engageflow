<?php

use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('project index lists only owned projects', function () {
    $owner = User::factory()->create();
    $otherUser = User::factory()->create();

    Project::factory()->create(['owner_user_id' => $owner->id, 'name' => 'My Project']);
    Project::factory()->create(['owner_user_id' => $otherUser->id, 'name' => 'Not Mine']);

    $response = $this->actingAs($owner)->get('/projects');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('Projects/Index')
        ->has('projects', 1)
        ->where('projects.0.name', 'My Project'));
});

test('project index shows empty state when user has no projects', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/projects');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('Projects/Index')
        ->has('projects', 0));
});

test('project create form renders', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/projects/create');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page->component('Projects/Create'));
});

test('user can create a project', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user);
    $response = postWithCsrf('/projects', [
        'name' => 'New Project',
        'description' => 'A test project',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('projects', [
        'owner_user_id' => $user->id,
        'name' => 'New Project',
        'description' => 'A test project',
    ]);
});

test('project creation fails with missing name', function () {
    $user = User::factory()->create();

    $this->actingAs($user);
    $response = postWithCsrf('/projects', ['name' => '', 'description' => '']);

    $response->assertSessionHasErrors('name');
});

test('owner can view their project', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_user_id' => $owner->id]);

    $response = $this->actingAs($owner)->get("/projects/{$project->id}");

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('Projects/Show')
        ->where('project.id', $project->id));
});

test('non-owner gets 404 when viewing another users project', function () {
    $owner = User::factory()->create();
    $otherUser = User::factory()->create();
    $project = Project::factory()->create(['owner_user_id' => $owner->id]);

    $response = $this->actingAs($otherUser)->get("/projects/{$project->id}");

    $response->assertStatus(404);
});

test('owner can edit their project', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_user_id' => $owner->id]);

    $response = $this->actingAs($owner)->get("/projects/{$project->id}/edit");

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('Projects/Edit')
        ->where('project.id', $project->id));
});

test('owner can update their project', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_user_id' => $owner->id, 'name' => 'Old Name']);

    $this->actingAs($owner);
    $response = putWithCsrf("/projects/{$project->id}", [
        'name' => 'Updated Name',
        'description' => 'Updated description',
    ]);

    $response->assertRedirect();
    expect($project->fresh()->name)->toBe('Updated Name');
    expect($project->fresh()->description)->toBe('Updated description');
});

test('non-owner gets 404 when updating another users project', function () {
    $owner = User::factory()->create();
    $otherUser = User::factory()->create();
    $project = Project::factory()->create(['owner_user_id' => $owner->id]);

    $this->actingAs($otherUser);
    $response = putWithCsrf("/projects/{$project->id}", ['name' => 'Hacked']);

    $response->assertStatus(404);
});

test('unauthenticated user cannot access projects', function () {
    $response = $this->get('/projects');

    $response->assertRedirect('/login');
});
