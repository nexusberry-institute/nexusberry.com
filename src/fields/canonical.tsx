// import type { Field } from 'payload';

// interface FieldFunctionProps {
//     hasGenerateFn?: boolean;
//     overrides?: Partial<Field>;
// }

// type FieldFunction = ({ hasGenerateFn, overrides }: FieldFunctionProps) => Field;

// export const CanonicalField: FieldFunction = ({ hasGenerateFn = false, overrides = {} }) => {
//     const field: Field = {
//         name: 'canonical',
//         label: 'Canonical URL',
//         type: 'text',
//         admin: {
//             description: 'The canonical URL for this page. Leave blank to use the default URL.',
//             placeholder: 'https://nexusberry.com/course/course-slug',
//             ...(overrides?.admin || {}),
//         },
//         // validate: (value) => {
//         //     if (value && typeof value === 'string' && !/^https?:\/\/.+/.test(value)) {
//         //         return 'Canonical URL must be a valid URL starting with http:// or https://';
//         //     }
//         //     return true;
//         // },
//         ...overrides,
//     };

//     return field;
// };
