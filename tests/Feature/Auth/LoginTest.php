<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Testing\TestResponse;

uses(RefreshDatabase::class);

// Helper: make a POST request with a valid CSRF token in the session.
// In Laravel 13, the test client does not automatically bypass CSRF.
// We seed the session with a known token and include it in the request.
function postWithCsrf(string $url, array $data = []): TestResponse
{
    $token = 'test-csrf-token';

    return test()
        ->withSession(['_token' => $token])
        ->post($url, array_merge($data, ['_token' => $token]));
}

test('login page renders as an Inertia component', function () {
    $response = $this->get('/login');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page->component('Auth/Login'));
});

test('user can log in with correct credentials', function () {
    $user = User::factory()->create([
        'email' => 'officer@example.com',
        'password' => Hash::make('password'),
    ]);

    $response = postWithCsrf('/login', [
        'email' => 'officer@example.com',
        'password' => 'password',
    ]);

    $response->assertRedirect('/');
    $this->assertAuthenticatedAs($user);
});

test('login fails with incorrect credentials', function () {
    User::factory()->create([
        'email' => 'officer@example.com',
        'password' => Hash::make('correct-password'),
    ]);

    $response = postWithCsrf('/login', [
        'email' => 'officer@example.com',
        'password' => 'wrong-password',
    ]);

    $response->assertSessionHasErrors('email');
    $this->assertGuest();
});

test('login fails with missing fields', function () {
    $response = postWithCsrf('/login', []);

    $response->assertSessionHasErrors(['email', 'password']);
    $this->assertGuest();
});

test('unauthenticated request to dashboard redirects to login', function () {
    $response = $this->get('/');

    $response->assertRedirect('/login');
});

test('authenticated user can access dashboard', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page->component('Dashboard'));
});

test('user can log out', function () {
    $user = User::factory()->create();
    $token = 'test-csrf-token';

    $response = $this
        ->actingAs($user)
        ->withSession(['_token' => $token])
        ->post('/logout', ['_token' => $token]);

    $response->assertRedirect('/login');
    $this->assertGuest();
});

test('guest cannot access logout route', function () {
    $token = 'test-csrf-token';

    $response = $this
        ->withSession(['_token' => $token])
        ->post('/logout', ['_token' => $token]);

    // Auth middleware redirects unauthenticated requests to login
    $response->assertRedirect('/login');
});
