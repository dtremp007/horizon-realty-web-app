import { NextPage, GetServerSideProps } from "next";
import { db } from "../lib/firebase.config";
import { doc, DocumentData, getDoc } from "firebase/firestore";

type Props = {
    data: DocumentData | undefined;
}

const TestPage: NextPage<Props> = ({data}) => {
    console.log(data)

    return (
        <div>{data && data.title}</div>
    )
}

export async function getServerSideProps<GetServerSideProps>(context: any) {
        const docRef = doc(db, "listings", "7DqAwKuUCT7TCa92kHP4");
        const docSnap = await getDoc(docRef);
        const data = docSnap.data()

      return {
        props: {
            data
        }
      };
}

export default TestPage;
