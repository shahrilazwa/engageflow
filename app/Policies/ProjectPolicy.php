<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\User;

class ProjectPolicy
{
    /** Owner can view their own Project. */
    public function view(User $user, Project $project): bool
    {
        return $project->isOwnedBy($user);
    }

    /** Owner can update their own Project. */
    public function update(User $user, Project $project): bool
    {
        return $project->isOwnedBy($user);
    }

    /** Owner can delete (soft-delete) their own Project. */
    public function delete(User $user, Project $project): bool
    {
        return $project->isOwnedBy($user);
    }

    /** Owner can restore their soft-deleted Project. */
    public function restore(User $user, Project $project): bool
    {
        return $project->isOwnedBy($user);
    }

    /** Any authenticated user can create a Project. */
    public function create(User $user): bool
    {
        return true;
    }
}
