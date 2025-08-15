'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from '@/hooks/use-toast'

interface FormField {
    id?: string;
    name: string;
    label: string;
    type: string;
    required?: boolean;
    options?: { label: string; value: string }[];
    width?: number;
    defaultValue?: any;
    placeholder?: string;
    rows?: number; // For textarea
}



type FormData = Record<string, string>;

const CertificateApplicationForm = () => {
    const [formData, setFormData] = useState<FormData>({});
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [error, setError] = useState('');
    const [formId, setFormId] = useState('');
    const [formFields, setFormFields] = useState<FormField[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [formTitle, setFormTitle] = useState('Certificate Application Form');
    const [formDescription, setFormDescription] = useState('Please fill out all the required fields to apply for your certificate');

    const router = useRouter();

    // Convert Payload field to our FormField format
    const convertPayloadField = (payloadField: any): FormField => {
        const field: FormField = {
            id: payloadField.id,
            name: payloadField.name,
            label: payloadField.label,
            type: payloadField.blockType || payloadField.type,
            required: payloadField.required || false,
            width: payloadField.width,
            defaultValue: payloadField.defaultValue,
            placeholder: payloadField.placeholder,
        };

        // Handle different field types
        switch (payloadField.blockType || payloadField.type) {
            case 'select':
            case 'radio':
                if (payloadField.options) {
                    field.options = payloadField.options.map((opt: any) => ({
                        label: opt.label,
                        value: opt.value
                    }));
                }
                break;

            case 'textarea':
                field.rows = payloadField.rows || 4;
                break;

            case 'checkbox':
                field.type = 'checkbox';
                break;

            case 'number':
                field.type = 'number';
                break;

            case 'email':
                field.type = 'email';
                break;

            case 'tel':
            case 'phone':
                field.type = 'tel';
                break;

            case 'date':
                field.type = 'date';
                break;

            default:
                field.type = 'text';
        }

        return field;
    };



    // Initialize form data based on fields
    const initializeFormData = (fields: FormField[]) => {
        const initialData: FormData = {};
        fields.forEach(field => {
            initialData[field.name] = field.defaultValue || '';
        });
        setFormData(initialData);
    };

    // Fetch form from Payload CMS
    useEffect(() => {
        const fetchForm = async () => {
            setIsLoading(true);

            try {
                // console.log('Fetching form from Payload CMS...');
                const response = await fetch('/api/forms?where[slug][equals]=certificate-application');

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                // console.log('Payload response:', result);

                if (result.docs && result.docs.length > 0) {
                    const form = result.docs[0];

                    // Set form metadata
                    setFormId(form.id);
                    setFormTitle(form.title || 'Certificate Application Form');
                    setFormDescription(form.description || 'Please fill out all the required fields to apply for your certificate');

                    // Convert Payload fields to our format
                    const convertedFields: FormField[] = [];

                    if (form.fields && Array.isArray(form.fields)) {
                        form.fields.forEach((field: any) => {
                            // Handle different Payload field structures
                            if (field.blockType) {
                                // Block-based fields
                                convertedFields.push(convertPayloadField(field));
                            } else if (field.type) {
                                // Direct field type
                                convertedFields.push(convertPayloadField(field));
                            }
                        });
                    }

                    // console.log('Converted fields:', convertedFields);
                    setFormFields(convertedFields);
                    initializeFormData(convertedFields);

                } else {
                    throw new Error('No form found with slug: certificate-application');
                }

            } catch (error) {
                console.error('Error fetching form from Payload:', error);

                toast({
                    title: 'Form Loading Issue',
                    description: 'Using default form fields. Please check your Payload CMS configuration.',
                    variant: 'destructive',
                });
            }

            setIsLoading(false);
        };

        fetchForm();
    }, []);





    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        // Handle checkbox
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked ? 'true' : 'false' }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        // Clear error when user starts typing
        if (error) setError('');
    };

    // Validate form
    const validateForm = () => {
        const requiredFields = formFields.filter(field => field.required);

        for (const field of requiredFields) {
            const fieldValue = formData[field.name];
            if (!fieldValue || fieldValue.trim() === '') {
                return `${field.label} is required`;
            }
        }

        const emailField = formFields.find(field => field.type === 'email');
        if (emailField) {
            const emailValue = formData[emailField.name];
            if (emailValue && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
                return 'Please enter a valid email address';
            }
        }

        return null;
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            setStatus('error');
            return;
        }

        setStatus('loading');
        setError('');

        const payload = {
            form: formId,
            submissionData: Object.entries(formData)
                .filter(([, value]) => value.trim() !== '')
                .map(([field, value]) => ({
                    field,
                    value,
                })),
        };

        console.log('Sending payload:', payload);

        try {
            const response = await fetch('/api/form-submissions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (!response.ok) {
                setStatus('error');
                setError(result?.message || 'Submission failed');
                toast({
                    title: 'Submission failed',
                    description: result?.message || 'Please try again later.',
                    variant: 'destructive',
                });
                return;
            }

            setStatus('success');
            toast({
                title: 'Form Submitted',
                description: result?.message || 'Your form was submitted successfully.',
                variant: 'success',
            });
            setTimeout(() => {
                router.push(result.redirect || '/forms/success-thank-you-page');
            }, 1500);
        } catch (err) {
            setStatus('error');
            setError('Something went wrong. Please try again later.');
            toast({
                title: 'Network Error',
                description: 'Something went wrong. Please try again later.',
                variant: 'destructive',
            });
        }
    };

    // Render field based on type
    const renderField = (field: FormField) => {
        const commonProps = {
            id: field.name,
            name: field.name,
            className: "w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 bg-white",
            required: field.required,
        };

        const labelElement = (
            <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor={field.name}>
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
        );

        switch (field.type) {
            case 'text':
            case 'email':
            case 'tel':
            case 'date':
            case 'number':
                return (
                    <div key={field.name}>
                        {labelElement}
                        <input
                            {...commonProps}
                            type={field.type}
                            value={formData[field.name] || ''}
                            onChange={handleChange}
                            placeholder={field.placeholder || `Enter your ${field.label.toLowerCase()}`}
                        />
                    </div>
                );

            case 'select':
                return (
                    <div key={field.name}>
                        {labelElement}
                        <select
                            {...commonProps}
                            value={formData[field.name] || ''}
                            onChange={handleChange}
                        >
                            <option value="">Select {field.label}</option>
                            {field.options?.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                );

            case 'textarea':
                return (
                    <div key={field.name}>
                        {labelElement}
                        <textarea
                            {...commonProps}
                            rows={field.rows || 4}
                            value={formData[field.name] || ''}
                            onChange={handleChange}
                            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                            className={`${commonProps.className} resize-vertical`}
                        />
                    </div>
                );

            case 'checkbox':
                return (
                    <div key={field.name} className="flex items-center">
                        <input
                            id={field.name}
                            name={field.name}
                            type="checkbox"
                            checked={formData[field.name] === 'true'}
                            onChange={handleChange}
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                            required={field.required}
                        />
                        <label htmlFor={field.name} className="ml-2 block text-sm text-gray-700">
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                    </div>
                );

            case 'radio':
                return (
                    <div key={field.name}>
                        {labelElement}
                        <div className="space-y-2">
                            {field.options?.map(option => (
                                <div key={option.value} className="flex items-center">
                                    <input
                                        id={`${field.name}-${option.value}`}
                                        name={field.name}
                                        type="radio"
                                        value={option.value}
                                        checked={formData[field.name] === option.value}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                                        required={field.required}
                                    />
                                    <label htmlFor={`${field.name}-${option.value}`} className="ml-2 block text-sm text-gray-700">
                                        {option.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            default:
                return (
                    <div key={field.name}>
                        {labelElement}
                        <input
                            {...commonProps}
                            type="text"
                            value={formData[field.name] || ''}
                            onChange={handleChange}
                            placeholder={field.placeholder || `Enter your ${field.label.toLowerCase()}`}
                        />
                    </div>
                );
        }
    };

    // Show loading state while fetching
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 px-4">
                <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading form from Payload CMS...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto bg-white  p-5 md:p-8 shadow-[10px_20px_10px] shadow-foreground/30 border-2 border-dashed border-primary-400 rounded-2xl">
                <h2 className="text-base md:text-3xl font-bold mb-2 text-center text-gray-800">
                    {formTitle}
                </h2>
                <p className="text-gray-600 text-center mb-8">
                    {formDescription}
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {formFields.length > 0 ? (
                        formFields.map(renderField)
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-500">
                                No form fields available. Please check your Payload CMS configuration.
                            </p>
                        </div>
                    )}

                    <div className="pt-4 flex justify-center">
                        <button
                            type="submit"
                            disabled={status === 'loading' || formFields.length === 0}
                            className={`w-full sm:w-auto py-4 px-2 md:px-6 rounded-lg font-medium text-white text-base md:text-lg transition-colors
                            ${status === 'loading' || formFields.length === 0
                                    ? 'bg-gray-500 cursor-not-allowed'
                                    : 'bg-primary hover:bg-primary active:bg-primary'
                                }`}
                        >
                            {status === 'loading' ? (
                                <span className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                                    Submitting Application...
                                </span>
                            ) : (
                                'Submit Certificate Application'
                            )}
                        </button>
                    </div>

                    {status === 'success' && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <div>
                                    <h3 className="text-green-800 font-medium">Success!</h3>
                                    <p className="text-green-700 text-sm">
                                        Your certificate application has been submitted successfully! We will review it and contact you within 2-3 business days.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {status === 'error' && error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <div>
                                    <h3 className="text-red-800 font-medium">Error</h3>
                                    <p className="text-red-700 text-sm">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </form>

            </div>
        </div>
    );
};

export default CertificateApplicationForm;