<?php

use Illuminate\Testing\TestResponse;
use Tests\TestCase;

/*
|--------------------------------------------------------------------------
| Test Case
|--------------------------------------------------------------------------
| The closure you provide to your test functions is always bound to a
| specific PHPUnit test case class. By default, that class is
| "PHPUnit\Framework\TestCase". Of course, you may need to change it
| using the "pest()" function to bind a different classes or traits.
*/

pest()->extend(TestCase::class)->in('Feature');
pest()->extend(TestCase::class)->in('Unit');

/*
|--------------------------------------------------------------------------
| Expectations
|--------------------------------------------------------------------------
| When you're writing tests, you often need to check that values meet
| certain conditions. The "expect()" function gives you access to a set
| of "expectations" methods that you can use to assert different things.
*/

/*
|--------------------------------------------------------------------------
| Functions
|--------------------------------------------------------------------------
| While Pest is very powerful out-of-the-box, you may have some testing
| code specific to your project that you don't want to repeat in every
| file. Here you can also expose helpers as global functions to help you
| to reduce the number of lines of code in your test files.
*/

/**
 * Make a POST request with a valid CSRF token in the session.
 * In Laravel 13, the test client does not automatically bypass CSRF.
 */
function postWithCsrf(string $url, array $data = []): TestResponse
{
    $token = 'test-csrf-token';

    return test()
        ->withSession(['_token' => $token])
        ->post($url, array_merge($data, ['_token' => $token]));
}

/**
 * Make a PUT request with a valid CSRF token in the session.
 */
function putWithCsrf(string $url, array $data = []): TestResponse
{
    $token = 'test-csrf-token';

    return test()
        ->withSession(['_token' => $token])
        ->put($url, array_merge($data, ['_token' => $token]));
}
