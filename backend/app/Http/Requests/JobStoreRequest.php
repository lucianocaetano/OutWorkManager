<?php

namespace App\Http\Requests;

use Carbon\Carbon;
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
            "description" => ["required", "string"],
            "is_check" => ["boolean"],
            "in_datetime" => ["required", "date_format:Y-m-d H:i"],
            "out_datetime" => ["required", "date_format:Y-m-d H:i"],
            'enterprise_id' => ["required", "exists:enterprises,id"],
        ];
    }

    public function prepareForValidation()
    {
        if ($this->has('in_datetime')) {
            $this->merge([
                'in_datetime' => Carbon::parse($this->input('in_datetime'))->format('Y-m-d H:i'),
            ]);
        }

        if($this->has('out_datetime')) {
            $this->merge([
                'out_datetime' => Carbon::parse($this->input('out_datetime'))->format('Y-m-d H:i'),
            ]);
        }

    }
}
