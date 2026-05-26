<?php

namespace App\Models;

use Database\Factories\ProjectFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
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

    /** The User who owns this Project. */
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_user_id');
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
