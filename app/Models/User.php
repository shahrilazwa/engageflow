<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable(['name', 'email', 'password', 'role'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** Roles available in v1. */
    public const ROLE_ADMIN = 'admin';

    public const ROLE_ENGAGEMENT_LEAD = 'engagement_lead';

    public const ROLE_ENGAGEMENT_OFFICER = 'engagement_officer';

    public const ROLES = [
        self::ROLE_ADMIN,
        self::ROLE_ENGAGEMENT_LEAD,
        self::ROLE_ENGAGEMENT_OFFICER,
    ];

    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /** Check if the user has the admin role. */
    public function isAdmin(): bool
    {
        return $this->role === self::ROLE_ADMIN;
    }
}
