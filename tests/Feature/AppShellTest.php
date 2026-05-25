<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('authenticated dashboard renders with app shell user data', function () {
    $user = User::factory()->create([
        'name' => 'Project Officer',
        'email' => 'officer@example.com',
    ]);

    $response = $this->actingAs($user)->get('/');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('Dashboard')
        ->where('auth.user.name', 'Project Officer')
        ->where('auth.user.email', 'officer@example.com'));
});
