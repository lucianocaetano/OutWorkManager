<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class JobStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "title" => ["required", "string"],
            "slug" => ["required", "string"],
            "is_check" => ["boolean"],
            "is_check_enterprise" => ["boolean"],
            "fechas" => ["required", "array"], // Cambiado para aceptar un array de fechas
            "fechas.*" => ["required", "date"], // Valida cada fecha individualmente
            'RUT_enterprise' => ["required", "string", "exists:enterprises,RUT"],
        ];
    }

    public function prepareForValidation() {
        $this->merge(
            [
                "slug" => str($this->title." ".uniqid())->slug()->value()
            ]
        );
    }
}
