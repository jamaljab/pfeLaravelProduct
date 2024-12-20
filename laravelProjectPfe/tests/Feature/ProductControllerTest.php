<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test de la méthode index (affichage des produits).
     *
     * @return void
     */
    public function test_index()
    {
        $category = Category::create(['name' => 'Category 1']);

        Product::create(['name' => 'Product 1', 'description' => 'Description 1', 'price' => 100, 'category_id' => $category->id]);
        Product::create(['name' => 'Product 2', 'description' => 'Description 2', 'price' => 200, 'category_id' => $category->id]);
        Product::create(['name' => 'Product 3', 'description' => 'Description 3', 'price' => 300, 'category_id' => $category->id]);

        $response = $this->get('/api/products');
        $response->assertStatus(200);

        $response->assertJsonFragment(['name' => 'Product 1']);
        $response->assertJsonFragment(['name' => 'Product 2']);
        $response->assertJsonFragment(['name' => 'Product 3']);
    }





    /**
     * Test de la méthode show (affichage d'un produit spécifique).
     *
     * @return void
     */
    public function test_show()
    {
        $category = Category::create(['name' => 'Category 1']);

        $product = Product::create([
            'name' => 'Test Product',
            'description' => 'Test Description',
            'price' => 100,
            'category_id' => $category->id
        ]);

        $response = $this->get("/api/products/{$product->id}");
        $response->assertStatus(200);
        $response->assertJsonFragment(['name' => 'Test Product']);
    }





    /**
     * Test de la méthode store (création d'un produit).
     *
     * @return void
     */
    public function test_store()
    {
        $category = Category::create(['name' => 'Category 1']);
        
        $data = [
            'name' => 'New Product',
            'description' => 'New Description',
            'price' => 150,
            'category_id' => $category->id
        ];

        $response = $this->post('/api/products', $data);
        $response->assertStatus(201);  
        $response->assertJsonFragment($data); 

        $this->assertDatabaseHas('products', ['name' => 'New Product']);
    }






    /**
     * Test de la méthode update (mise à jour d'un produit).
     *
     * @return void
     */
    public function test_update()
    {
        $category = Category::create(['name' => 'Category 1']);
        $product = Product::create([
            'name' => 'Old Product',
            'description' => 'Old Description',
            'price' => 100,
            'category_id' => $category->id
        ]);

        $data = ['name' => 'Updated Product', 'description' => 'Updated Description', 'price' => 200, 'category_id' => $category->id];

        $response = $this->put("/api/products/{$product->id}", $data);
        $response->assertStatus(200);
        $response->assertJsonFragment($data);

        $this->assertDatabaseHas('products', ['name' => 'Updated Product']);
    }







    /**
     * Test de la méthode destroy (suppression d'un produit).
     *
     * @return void
     */
    public function test_destroy()
    {
        $category = Category::create(['name' => 'Category 1']);
        $product = Product::create([
            'name' => 'Product to Delete',
            'description' => 'Description to Delete',
            'price' => 100,
            'category_id' => $category->id
        ]);

        $response = $this->delete("/api/products/{$product->id}");
        $response->assertStatus(204); 

        $this->assertDatabaseMissing('products', ['name' => 'Product to Delete']);
    }
}
