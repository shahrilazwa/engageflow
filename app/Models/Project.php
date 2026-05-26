<?php

namespace App\Models;

use Database\Factories\ProjectFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model
{
    /** @use HasFactory<ProjectFactory> */
    use HasFactory, SoftDeletes;

    public const STATUS_ACTIVE = 'active';

    public const STATUS_ARCHIVED = 'archived';

    protected $fillable = [
        'owner_user_id',
        'name',
        'description',
        'status',
    ];

    protected static function booted(): void
    {
        // Auto-create a ProjectWorkflow with an empty definition when a Project is created.
        static::created(function (Project $project) {
            $project->workflow()->create([
                'definition' => ProjectWorkflow::emptyDefinition(),
                'version' => 1,
            ]);
        });
    }

    /** The User who owns this Project. */
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_user_id');
    }

    /** The workflow definition for this Project. */
    public function workflow(): HasOne
    {
        return $this->hasOne(ProjectWorkflow::class);
    }

    /** Check if this Project is owned by the given User. */
    public function isOwnedBy(User $user): bool
    {
        return $this->owner_user_id === $user->id;
    }

    /** Check if this Project is archived. */
    public function isArchived(): bool
    {
        return $this->status === self::STATUS_ARCHIVED;
    }
}
