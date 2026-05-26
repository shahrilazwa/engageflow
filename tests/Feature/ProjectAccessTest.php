<?php

use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('user can create a project', function () {
    $user = User::factory()->create();

    $project = Project::factory()->create([
        'owner_user_id' => $user->id,
        'name' => 'GovTech Libat Urus',
    ]);

    expect($project->name)->toBe('GovTech Libat Urus');
    expect($project->owner->id)->toBe($user->id);
    expect($project->isOwnedBy($user))->toBeTrue();
});

test('user has many projects', function () {
    $user = User::factory()->create();

    Project::factory()->count(3)->create(['owner_user_id' => $user->id]);

    expect($user->projects)->toHaveCount(3);
});

test('project belongs to owner user', function () {
    $project = Project::factory()->create();

    expect($project->owner)->toBeInstanceOf(User::class);
    expect($project->owner->id)->toBe($project->owner_user_id);
});

test('owner can access their project via policy', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_user_id' => $owner->id]);

    expect($owner->can('view', $project))->toBeTrue();
    expect($owner->can('update', $project))->toBeTrue();
    expect($owner->can('delete', $project))->toBeTrue();
});

test('non-owner cannot access another users project via policy', function () {
    $owner = User::factory()->create();
    $otherUser = User::factory()->create();
    $project = Project::factory()->create(['owner_user_id' => $owner->id]);

    expect($otherUser->can('view', $project))->toBeFalse();
    expect($otherUser->can('update', $project))->toBeFalse();
    expect($otherUser->can('delete', $project))->toBeFalse();
});

test('any authenticated user can create a project via policy', function () {
    $user = User::factory()->create();

    expect($user->can('create', Project::class))->toBeTrue();
});

test('project can be soft-deleted and restored', function () {
    $project = Project::factory()->create();

    $project->delete();

    expect(Project::find($project->id))->toBeNull();
    expect(Project::withTrashed()->find($project->id))->not->toBeNull();

    $project->restore();

    expect(Project::find($project->id))->not->toBeNull();
});

test('project can be archived and reactivated', function () {
    $project = Project::factory()->create(['status' => Project::STATUS_ACTIVE]);

    expect($project->isArchived())->toBeFalse();

    $project->update(['status' => Project::STATUS_ARCHIVED]);

    expect($project->fresh()->isArchived())->toBeTrue();

    $project->update(['status' => Project::STATUS_ACTIVE]);

    expect($project->fresh()->isArchived())->toBeFalse();
});

test('project scoping returns only owned projects', function () {
    $owner = User::factory()->create();
    $otherUser = User::factory()->create();

    Project::factory()->count(2)->create(['owner_user_id' => $owner->id]);
    Project::factory()->count(3)->create(['owner_user_id' => $otherUser->id]);

    expect($owner->projects)->toHaveCount(2);
    expect($otherUser->projects)->toHaveCount(3);
});
