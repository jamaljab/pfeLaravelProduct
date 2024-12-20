<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Afficher la liste des catégories.
     *
     * @return \Illuminate\Http\Response
     */    
    public function index()
    {
        return Category::all();
    }



    /**
     * Créer une nouvelle catégorie.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories',
        ]);

        $category = Category::create($validated);

        return response()->json($category, 201);
    }




    /**
     * Afficher une catégorie spécifique.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $category = Category::findOrFail($id);
        return response()->json($category);
    }



    /**
     * Mettre à jour une catégorie existante.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $id,
        ]);

        $category->update($validated);

        return response()->json($category);
    }




    /**
     * Supprimer une catégorie.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();

        return response()->json(null, 204);
    }
}
