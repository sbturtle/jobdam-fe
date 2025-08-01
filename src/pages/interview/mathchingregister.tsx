/** @format */
import * as React from "react";
import { useLocation, useNavigate } from "react-router";

import { Form, Textarea } from "@/components/ui/form";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useDispatch } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";
import FieldsSelect from "./components/fieldsSelect";
import { useMatchingProfile } from "./api/get-matchingProfile";
import { interviewSchema } from "./schemas/interviewSchema";
import ContentsBox from "@/components/layout/contentsBox";
import { Button } from "@/components/ui/button";
import { setProgressStep } from "@/store/slices/uistate";
import { paths } from "@/config/paths";
import { getHasResume } from "./api/get-hasResume";

const InterviewRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(interviewSchema),
    defaultValues: {
      matchType: undefined,
      experienceType: "NEW",
      jobCode: "",
      jobDetailCode: "",
    },
  });
  const { data: matchingProfile } = useMatchingProfile();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const stepParam = params.get("step");

  React.useEffect(() => {
    dispatch(setProgressStep(1));
  }, [location.search, stepParam, dispatch]);

  const matchType = useWatch({
    control: form.control,
    name: "matchType",
  });

  const introduce = useWatch({
    control: form.control,
    name: "introduce",
  });

  const interviewType = useWatch({
    control: form.control,
    name: "interviewType",
  });
  const [mediaAllowed, setMediaAllowed] = React.useState<boolean | null>(null);
  React.useEffect(() => {
    const checkResumeAndRequestMedia = async () => {
      const hasResume = await getHasResume();
      if (!hasResume) {
        if (
          window.confirm(
            "이력서가 없습니다. 등록하시겠습니까?\n\n이력서가 있어야 면접 시 상대방이 AI질문을 확인할 수 있습니다."
          )
        ) {
          navigate(paths.mypage.resume.path);
          return;
        }
      }
      try {
        await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setMediaAllowed(true);
      } catch (err) {
        alert(
          "화상면접을 위해 카메라/마이크 권한이 필요합니다.\n브라우저 설정에서 허용해 주세요.\n권한 차단시 더이상 진행이 불가능합니다."
        );
        setMediaAllowed(false);
      }
    };
    checkResumeAndRequestMedia();
  }, []);
  return (
    <Form
      form={form}
      onSubmit={(values: any) => {
        console.log(values);
        navigate(`${paths.interview.matching.path}`, {
          state: values,
        });
      }}
    >
      {({ control }) => {
        return (
          <>
            {/* 직무+인원선택 */}
            <FieldsSelect
              form={form}
              control={control}
              profile={matchingProfile}
            />
            {/* 인원수 입력되면 자기소개 */}
            {matchType && (
              <div className="mt-[50px]">
                <ContentsBox title="면접에서 말할 자기소개를 간단히 작성해주세요.">
                  <Controller
                    control={control}
                    name="introduce"
                    render={({ field }) => (
                      <Textarea
                        placeholder="ex) 문제를 구조적으로 정리하고 해결하는 걸 좋아하는 UX 디자이너 지망생입니다."
                        {...field}
                        maxLength={300}
                      />
                    )}
                  />
                </ContentsBox>
              </div>
            )}

            {/* 자기소개 입력되면 면접유형 */}
            {introduce && introduce.trim().length > 0 && (
              <div className="relative mt-[50px]">
                <ContentsBox title="어떤 종류의 면접을 준비하시나요?">
                  <p className="absolute top-1 left-65 text-gray-400">
                    *선택한 유형은 매칭 참고용으로만 사용돼요.
                  </p>
                  <Controller
                    control={form.control}
                    name="interviewType"
                    render={({ field }) => (
                      <div className="w-fll flex flex-row gap-[20px]">
                        <Button
                          type="button"
                          size="register"
                          className="text-black text-[18px]"
                          variant={
                            field.value === "PERSONALITY"
                              ? "outline"
                              : "register"
                          }
                          onClick={() => field.onChange("PERSONALITY")}
                        >
                          <img src="/matchingIcon/인성.svg" alt="1:1" />
                          인성
                        </Button>
                        <Button
                          type="button"
                          size="register"
                          className="text-black text-[18px]"
                          variant={
                            field.value === "JOB" ? "outline" : "register"
                          }
                          onClick={() => field.onChange("JOB")}
                        >
                          <img src="/matchingIcon/직무.svg" alt="1:1" />
                          직무
                        </Button>
                        <Button
                          type="button"
                          size="register"
                          className="text-black text-[18px]"
                          variant={
                            field.value === "TECHNICAL" ? "outline" : "register"
                          }
                          onClick={() => field.onChange("TECHNICAL")}
                        >
                          <img src="/matchingIcon/기술.svg" alt="1:1" />
                          기술
                        </Button>
                      </div>
                    )}
                  />
                </ContentsBox>
              </div>
            )}
            {/* 인터뷰타입 + 자기소개 입력되면 면접유형 */}
            {interviewType && introduce && introduce.trim().length > 0 && (
              <div className="relative top-[15%] left-0 flex justify-center items-center">
                <button
                  // type="submit"
                  //disabled={!mediaAllowed} 임시로 주석해둔거 원래 열어야함
                  className="bg-[#488fff] h-[65px] w-[40%] text-[white] text-[24px] cursor-pointer rounded-[10px]"
                >
                  입력 완료
                </button>
                {mediaAllowed === false && (
                  <div className="text-red-500 text-[16px] ml-3 mt-2 text-center">
                    카메라/마이크 권한을 허용해야
                    <br />
                    진행할 수 있습니다.
                    <br />
                    또한, 다른 앱이나 웹에서 카메라/마이크를 사용 중일 경우에도
                    <br />
                    이용이 불가능합니다.(1컴에서 여러 브라우저로 테스트 할 때를
                    대비해 임시로 열어둠)
                  </div>
                )}
              </div>
            )}
          </>
        );
      }}
    </Form>
  );
};

export default InterviewRegister;
