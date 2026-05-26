<?php

namespace Database\Factories;

use App\Models\Project;
use App\Models\ProjectWorkflow;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProjectWorkflow>
 */
class ProjectWorkflowFactory extends Factory
{
    protected $model = ProjectWorkflow::class;

    public function definition(): array
    {
        return [
            'project_id' => Project::factory(),
            'definition' => ProjectWorkflow::emptyDefinition(),
            'version' => 1,
        ];
    }

    /** Create a workflow with sample nodes. */
    public function withSampleNodes(): static
    {
        return $this->state(fn () => [
            'definition' => [
                'version' => 1,
                'type' => 'ordered_stages',
                'nodes' => [
                    [
                        'id' => 'planning',
                        'type' => 'stage',
                        'label' => 'Perancangan',
                        'mandatory' => true,
                        'order' => 1,
                        'position' => ['x' => 120, 'y' => 80],
                    ],
                    [
                        'id' => 'execution',
                        'type' => 'stage',
                        'label' => 'Pelaksanaan',
                        'mandatory' => true,
                        'order' => 2,
                        'position' => ['x' => 380, 'y' => 80],
                    ],
                ],
                'edges' => [
                    [
                        'id' => 'planning_to_execution',
                        'from' => 'planning',
                        'to' => 'execution',
                    ],
                ],
                'viewport' => ['x' => 0, 'y' => 0, 'zoom' => 1],
            ],
        ]);
    }
}
