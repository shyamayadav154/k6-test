import http from "k6/http";
import { check, sleep } from "k6";
import {Trend} from 'k6/metrics'

export const options = {
  // A number specifying the number of VUs to run concurrently.
  vus: 100,
  // A string specifying the total duration of the test run.
  duration: "30s",

  // The following section contains configuration options for execution of this
  // test script in Grafana Cloud.
  //
  // See https://grafana.com/docs/grafana-cloud/k6/get-started/run-cloud-tests-from-the-cli/
  // to learn about authoring and running k6 test scripts in Grafana k6 Cloud.
  //
  // cloud: {
  //   // The ID of the project to which the test is assigned in the k6 Cloud UI.
  //   // By default tests are executed in default project.
  //   projectID: "",
  //   // The name of the test in the k6 Cloud UI.
  //   // Test runs with the same name will be grouped.
  //   name: "script.js"
  // },

  // Uncomment this section to enable the use of Browser API in your tests.
  //
  // See https://grafana.com/docs/k6/latest/using-k6-browser/running-browser-tests/ to learn more
  // about using Browser API in your test scripts.
  //
  // scenarios: {
  //   // The scenario name appears in the result summary, tags, and so on.
  //   // You can give the scenario any name, as long as each name in the script is unique.
  //   ui: {
  //     // Executor is a mandatory parameter for browser-based tests.
  //     // Shared iterations in this case tells k6 to reuse VUs to execute iterations.
  //     //
  //     // See https://grafana.com/docs/k6/latest/using-k6/scenarios/executors/ for other executor types.
  //     executor: 'shared-iterations',
  //     options: {
  //       browser: {
  //         // This is a mandatory parameter that instructs k6 to launch and
  //         // connect to a chromium-based browser, and use it to run UI-based
  //         // tests.
  //         type: 'chromium',
  //       },
  //     },
  //   },
  // }
};

const cookiesString = `next-auth.csrf-token=49c2b6bbd3e0bc97fdcb1b5d3b487d592470002364dda6a74dcbd3e7c4391f50%7Ceb5a3b1db5c575a6eee1db9a531f2b3ed9b469b3fec698a4e6516e94f4f9581b; cookieconsent_status=dismiss; next-auth.callback-url=http%3A%2F%2Flocalhost%3A4001%2F; next-auth.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..LiOdDm8ZrD1F0EYw.ptumWjzWXqHaM7NcPa9B4XFusPEqKYbobP-PzQqxfWFmLLp5OhumHvGrt7sgzTV3QPAxEbXfFkJXgHqEqoDox97C_T4UWYGsAFmvYjlf6xMoK0e8mY1xQeuSFIGObFkvJSFKspWWUoT88317rjQXkEmS21Pbw3t6OVDTRCZYgmgIqdh91-m_fSIe3TjVLeMMG0UnC00riV3im2B6Vt2CpWx5WIY-JZ20_Opo4vtGtpS9anW24lvsJARltgrPNaI42lwCBqOpD9rYaSEjR5heidHVf-gBAhLNN9RPFlEGEm6iyYgWjXhUP350mjpooL81ENs941h96gUYe8fRnOpSGt55xoN2sW9XXGIP77ozBmEvPCTC14cx7-Y1Yf-NcJW6rLNLLf9fXeV4x4PSySOdKQY4IfqjsoL3IQPZfi4.Em20cExmjST8kM1Iixr3Fg `;

const nexTauthCookie =
  "eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..LiOdDm8ZrD1F0EYw.ptumWjzWXqHaM7NcPa9B4XFusPEqKYbobP-PzQqxfWFmLLp5OhumHvGrt7sgzTV3QPAxEbXfFkJXgHqEqoDox97C_T4UWYGsAFmvYjlf6xMoK0e8mY1xQeuSFIGObFkvJSFKspWWUoT88317rjQXkEmS21Pbw3t6OVDTRCZYgmgIqdh91-m_fSIe3TjVLeMMG0UnC00riV3im2B6Vt2CpWx5WIY-JZ20_Opo4vtGtpS9anW24lvsJARltgrPNaI42lwCBqOpD9rYaSEjR5heidHVf-gBAhLNN9RPFlEGEm6iyYgWjXhUP350mjpooL81ENs941h96gUYe8fRnOpSGt55xoN2sW9XXGIP77ozBmEvPCTC14cx7-Y1Yf-NcJW6rLNLLf9fXeV4x4PSySOdKQY4IfqjsoL3IQPZfi4.Em20cExmjST8kM1Iixr3Fg";

const url = 'https://staging.lief.care/api/graphql'
// const url = "http://localhost:4001/api/graphql";

const query2 = `
query comp{
  companies {
    id
    name
    
    homes {
      id
      name
      tasks {
        id
      }
      taskTypes {
        id
        taskType
      }
      hrEmployees {
        id
        name
        
      
      }
      cyps {
        id
        name
        cypNightAttendance {
          id
          
        }
      }
    }
  }
}
`;

const payload = JSON.stringify({
  query: query2,
});

const responseTrend = new Trend('response_time');

// The function that defines VU logic.
//
// See https://grafana.com/docs/k6/latest/examples/get-started-with-k6/ to learn more
// about authoring k6 scripts.
//
export default function () {
  // http.get('https://test.k6.io');
  // const url = 'https://staging.lief.care/dashboard'

  const jar = http.cookieJar();
  jar.set(url, "next-auth.session-token", nexTauthCookie);
  // jar.set("https://httpbin.test.k6.io/cookies", "my_cookie", "hello world");

  const cookies = {
    my_cookie: {
      value: "hello world 2",
      replace: true,
    },
  };

  const res = http.post(url, payload, {
    cookies,
    headers: {
      "Content-Type": "application/json",
      // 'next-auth.session-token': nexTauthCookie
    },
  });

    responseTrend.add(res.timings.duration);

  // const json = res.json();
  // console.log(JSON.stringify(json, null, 2));

  check(res, {
    "status is 200": (r) => r.status === 200,
    "GET response time < 200ms": (r) => r.timings.duration < 200,
    "has cookies": (r) => r.cookies !== null,
    "Get Users has no errors": (r) => !r.json().errors,
    'returns "data"': (r) => r.json().data,
  });

  // console.log({ res });
  // const result = res.json()
  // console.log({result})

  sleep(1);
}

// Define handleSummary to create a detailed report
// export function handleSummary(data) {
//     const p90 = data.metrics.response_time.values['p(90)'];
//     const p95 = data.metrics.response_time.values['p(95)'];
//     
//     console.log(`
// =================================
// Performance Metrics:
// ---------------------------------
// P90 Response Time: ${p90.toFixed(2)}ms
// P95 Response Time: ${p95.toFixed(2)}ms
// =================================
//     `);
//
//     return {
//         'summary.json': JSON.stringify(data),
//     };
// }
