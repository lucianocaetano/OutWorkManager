<?php

namespace App\Http\Requests;

use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;

class JobEnterpriseUpdateRequest extends FormRequest
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
            "description" => ["string"],
            "is_check_enterprise" => ["boolean"],
            "date" => ["date", 'date_format:Y-m-d'],
            "in_time" => ['date_format:H:i'],
            "out_time" => ['date_format:H:i'],
        ];
    }

    public function prepareForValidation()
    {
        if ($this->has('in_datetime')) {
            $this->merge([
                'in_datetime' => Carbon::parse($this->input('in_datetime'))->format('Y-m-d H:i'),
            ]);
        }

        if ($this->has('out_datetime')) {
            $this->merge([
                'out_datetime' => Carbon::parse($this->input('out_datetime'))->format('Y-m-d H:i'),
            ]);
        }

    }
}
