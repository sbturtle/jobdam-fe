/** @format */

import InterviewLayout from "@/components/layout/interview-layout";
import InterviewRegister from "@/pages/interview/mathchingregister";

const InterviewRegisterRoute = () => {
  // const navigate = useNavigate();
  // const [searchParams] = useSearchParams();
  // const redirectTo = searchParams.get("redirectTo");

  // const onValid = (data: any) => {
  //   console.log("폼 데이터:", data);

  //   navigate("/interview/matching"); // 제출 성공 후 이동
  // };

  return (
    <>
      <InterviewLayout
        register={true}
        title={
          <>
            모의면접을 위한
            <br />
            매칭 정보를 입력해주세요.
          </>
        }
        showIcon={true}
      >
        <InterviewRegister></InterviewRegister>
      </InterviewLayout>
    </>
  );
};

export default InterviewRegisterRoute;
