<?php

namespace Database\Factories;

use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Project>
 */
class ProjectFactory extends Factory
{
    protected $model = Project::class;

    public function definition(): array
    {
        return [
            'owner_user_id' => User::factory(),
            'name' => fake()->sentence(3),
            'description' => fake()->optional()->paragraph(),
            'status' => Project::STATUS_ACTIVE,
        ];
    }

    /** Set the Project status to archived. */
    public function archived(): static
    {
        return $this->state(fn () => ['status' => Project::STATUS_ARCHIVED]);
    }
}
