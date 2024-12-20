<?php

namespace Tests\Feature;

use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test de la méthode store (création).
     *
     * @return void
     */
    public function test_store()
    {
        $data = ['name' => 'New Category'];

        $response = $this->post('/api/categories', $data);
        $response->assertStatus(201);
        $response->assertJsonFragment($data); 

        $this->assertDatabaseHas('categories', ['name' => 'New Category']);
    }





    /**
     * Test de la méthode index (affichage).
     *
     * @return void
     */
    public function test_index()
    {
        Category::create(['name' => 'Category 1']);
        Category::create(['name' => 'Category 2']);
        Category::create(['name' => 'Category 3']);

        $response = $this->get('/api/categories');
        $response->assertStatus(200);

        $response->assertJsonFragment(['name' => 'Category 1']);
        $response->assertJsonFragment(['name' => 'Category 2']);
        $response->assertJsonFragment(['name' => 'Category 3']);
    }




    /**
     * Test de la méthode show (affichage d'une catégorie spécifique).
     *
     * @return void
     */
    public function test_show()
    {
        $category = Category::create(['name' => 'Test Category']);

        $response = $this->get("/api/categories/{$category->id}");
        $response->assertStatus(200);
        $response->assertJsonFragment(['name' => 'Test Category']);
    }




    /**
     * Test de la méthode update (mise à jour d'une catégorie).
     *
     * @return void
     */
    public function test_update()
    {
        $category = Category::create(['name' => 'Old Category']);
        $data = ['name' => 'Updated Category'];

        $response = $this->put("/api/categories/{$category->id}", $data);
        $response->assertStatus(200);
        $response->assertJsonFragment($data);

        $this->assertDatabaseHas('categories', ['name' => 'Updated Category']);
    }





    /**
     * Test de la méthode destroy (suppression d'une catégorie).
     *
     * @return void
     */
    public function test_destroy()
    {
        $category = Category::create(['name' => 'Category to Delete']);

        $response = $this->delete("/api/categories/{$category->id}");
        $response->assertStatus(204);

        $this->assertDatabaseMissing('categories', ['name' => 'Category to Delete']);
    }
}
