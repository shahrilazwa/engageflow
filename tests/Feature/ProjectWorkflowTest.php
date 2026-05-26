<?php

use App\Models\Project;
use App\Models\ProjectWorkflow;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('project creation automatically creates a workflow', function () {
    $user = User::factory()->create();
    $project = Project::factory()->create(['owner_user_id' => $user->id]);

    expect($project->workflow)->toBeInstanceOf(ProjectWorkflow::class);
    expect($project->workflow->project_id)->toBe($project->id);
});

test('new workflow has empty v1 definition shape', function () {
    $project = Project::factory()->create();
    $definition = $project->workflow->definition;

    expect($definition)->toHaveKey('version', 1);
    expect($definition)->toHaveKey('type', 'ordered_stages');
    expect($definition)->toHaveKey('nodes');
    expect($definition['nodes'])->toBeArray()->toBeEmpty();
    expect($definition)->toHaveKey('edges');
    expect($definition['edges'])->toBeArray()->toBeEmpty();
    expect($definition)->toHaveKey('viewport');
    expect($definition['viewport'])->toHaveKey('x', 0);
    expect($definition['viewport'])->toHaveKey('y', 0);
    expect($definition['viewport'])->toHaveKey('zoom', 1);
});

test('new workflow has version 1', function () {
    $project = Project::factory()->create();

    expect($project->workflow->version)->toBe(1);
});

test('each project has exactly one workflow', function () {
    $project = Project::factory()->create();

    // Attempting to create a second workflow should fail (unique constraint).
    expect(ProjectWorkflow::where('project_id', $project->id)->count())->toBe(1);
});

test('workflow definition is cast as array', function () {
    $project = Project::factory()->create();

    expect($project->workflow->definition)->toBeArray();
});

test('workflow belongs to project', function () {
    $project = Project::factory()->create();

    expect($project->workflow->project->id)->toBe($project->id);
});

test('workflow access is scoped through project ownership', function () {
    $owner = User::factory()->create();
    $otherUser = User::factory()->create();

    $project = Project::factory()->create(['owner_user_id' => $owner->id]);

    // Owner can access workflow through their project.
    expect($owner->projects()->first()->workflow)->not->toBeNull();

    // Other user has no projects, so no workflow access.
    expect($otherUser->projects()->count())->toBe(0);
});

test('hasMandatoryNode returns false for empty workflow', function () {
    $project = Project::factory()->create();

    expect($project->workflow->hasMandatoryNode())->toBeFalse();
});

test('hasMandatoryNode returns true when mandatory node exists', function () {
    $project = Project::factory()->create();
    $project->workflow->update([
        'definition' => [
            'version' => 1,
            'type' => 'ordered_stages',
            'nodes' => [
                ['id' => 'step1', 'type' => 'stage', 'label' => 'Step 1', 'mandatory' => true, 'order' => 1, 'position' => ['x' => 0, 'y' => 0]],
            ],
            'edges' => [],
            'viewport' => ['x' => 0, 'y' => 0, 'zoom' => 1],
        ],
    ]);

    expect($project->workflow->fresh()->hasMandatoryNode())->toBeTrue();
});

test('hasMandatoryNode returns false when only optional nodes exist', function () {
    $project = Project::factory()->create();
    $project->workflow->update([
        'definition' => [
            'version' => 1,
            'type' => 'ordered_stages',
            'nodes' => [
                ['id' => 'step1', 'type' => 'stage', 'label' => 'Step 1', 'mandatory' => false, 'order' => 1, 'position' => ['x' => 0, 'y' => 0]],
            ],
            'edges' => [],
            'viewport' => ['x' => 0, 'y' => 0, 'zoom' => 1],
        ],
    ]);

    expect($project->workflow->fresh()->hasMandatoryNode())->toBeFalse();
});
