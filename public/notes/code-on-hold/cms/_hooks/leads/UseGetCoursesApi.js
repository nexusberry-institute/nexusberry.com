import axios from 'axios';
import { useQuery } from 'react-query';
import * as qs from 'qs-esm';

export default function UseGetCoursesApi() {
    const {
        data,
        isLoading,
        isError,
        error,
    } = useQuery(
        ['use-get-Courses-api'],
        async () => {
            const url = makeUrl();
            const { data } = await axios.get(url);
            return data;
        },
        {
            // enabled: !!page,
            select: (apiData) => {
                const Courses = transform(apiData.data);
                return Courses;
            },
        }
    );

    return {
        courses: data,
        isLoading,
        isError,
        error,
    };
}

const makeUrl = () => {
    const query = qs.stringify(
        {
            // populate: {
            //     webCourse: {
            //       populate: true,
            //     },
            //   },
        },
        {
            encodeValuesOnly: true,
        }
    );

    const url = `${process.env.NEXT_PUBLIC_API_KEY}/web-courses?${query}`;
    return url;
};



const transform = (Courses) => {
    Courses = Courses.map((Course) => {
        let c = { id: Course.id, ...Course.attributes };
        return c;
    });
    // console.log('useExistingReviewsApi:transform = ', reviews);
    return Courses;
};