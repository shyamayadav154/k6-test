import http from "k6/http";
import { check, sleep } from "k6";
import { Trend } from "k6/metrics";

// export const options = {
//   // Key configurations for Stress in this section
//   stages: [
//     { duration: '10m', target: 200 }, // traffic ramp-up from 1 to a higher 200 users over 10 minutes.
//     { duration: '30m', target: 200 }, // stay at higher 200 users for 30 minutes
//     { duration: '5m', target: 0 }, // ramp-down to 0 users
//   ],
// };

export const options = {
  // stages: [
  //   { duration: "1m", target: 500 }, // traffic ramp-up from 1 to a higher 200 users over 10 minutes.
  //   { duration: "3m", target: 200 }, // stay at higher 200 users for 30 minutes
  //   { duration: "5m", target: 0 }, // ramp-down to 0 users
  // ],

  // A number specifying the number of VUs to run concurrently.
  vus: 10,
  // A string specifying the total duration of the test run.
  duration: "10s",

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

const cookiestring = `__Host-next-auth.csrf-token=34ccca5181e853beead247c2ba9276f5f785e02943537ae0b8ff027800ee9a39%7C7865e77c0d004359a0b2ce2de155892bf4e2fdd401d447fe1eca741a050a5746; __Secure-next-auth.callback-url=https%3A%2F%2Fstaging.lief.care%2F; cookieconsent_status=dismiss; __Secure-next-auth.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..x39RQq4yGPGL8dEf.ckk-XX_7jDb1xEwQ6PbFos-awmvimv0t8_aopx3UqRORPj99HrTiovsi9d2dT0bf45E4ey9AW9-mgx7WulNA5xQmvWgzLU3H_Cg6NsHqHuVqCdM5lFvLU66E0FoL9zmkkbiXHKD81jaLMaZ7mVBIZMDdju7bYuBS0LafX_wF16uK-Zt2zic2HC4fY_HPGEsbnN5PnDSiYEY_qgXPoHT5PPZbiRxp9EUK1ll1zvgXX3-C-Ad6SKeRiJD1YTQQNlg1mPolNrwSAYlqn-7WSSujrBTlntyIoeNz0KWvuRzoB0jgVmbg5DlB10Hq78aG6HWFW-qsl2cXdFXfKk-zQKoxLP2vW3icZ2y4aYjJjjG4y1yft5Ky85kevR887ctY0LtIo8MpZ4frvBPDMp9RJIuNYa1YMOGJ5KwH83FLF34.VhWiyj87zqxVjAty1H7RYQ`;

const nexTauthCookie =
  "eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..x39RQq4yGPGL8dEf.ckk-XX_7jDb1xEwQ6PbFos-awmvimv0t8_aopx3UqRORPj99HrTiovsi9d2dT0bf45E4ey9AW9-mgx7WulNA5xQmvWgzLU3H_Cg6NsHqHuVqCdM5lFvLU66E0FoL9zmkkbiXHKD81jaLMaZ7mVBIZMDdju7bYuBS0LafX_wF16uK-Zt2zic2HC4fY_HPGEsbnN5PnDSiYEY_qgXPoHT5PPZbiRxp9EUK1ll1zvgXX3-C-Ad6SKeRiJD1YTQQNlg1mPolNrwSAYlqn-7WSSujrBTlntyIoeNz0KWvuRzoB0jgVmbg5DlB10Hq78aG6HWFW-qsl2cXdFXfKk-zQKoxLP2vW3icZ2y4aYjJjjG4y1yft5Ky85kevR887ctY0LtIo8MpZ4frvBPDMp9RJIuNYa1YMOGJ5KwH83FLF34.VhWiyj87zqxVjAty1H7RYQ";

const cookieStr =
  "next-auth.csrf-token=49c2b6bbd3e0bc97fdcb1b5d3b487d592470002364dda6a74dcbd3e7c4391f50%7Ceb5a3b1db5c575a6eee1db9a531f2b3ed9b469b3fec698a4e6516e94f4f9581b; cookieconsent_status=dismiss; next-auth.callback-url=http%3A%2F%2Flocalhost%3A4001%2F; ajs_anonymous_id=%22d19cd8cb-ac93-48a2-b024-a110e698f5cd%22; next-auth.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..Qz_RO9q95I4a8s4L.8ctPcRqL4hTNNHhqUvj8IHCm23flzxg7jZEh-50cl7toLr84x6fHyn7nckJprNXoW7KUuh1blvXWhAs2_b0I8CAkwDmS2iRHJAXOcZlqhInHVyNOK4M3Ih1wY79VOp4RzUPIjoxY0Dwoa2LLK-OuZ37z6UFIKvloWiX0KsVa9TasMMbwTwZgAjCEWjVo4jFtCtBAH08ahAp2h4XPFwMU0s4XQYYObPkV88LcEEfpzFZ6TmYlFPjWiK3LcTxqgUOyv7AH0oysJu04WVW7-2UKxrw3atSOi1UIDyrsodHbmmcUHPQt7SywLc7B7IiJVKXSrNDIuk3yXLcmZWykyzEggeds4GHyxaPZu37kfoGQ-U7_OoKgBdzJeGqQ7hgc7mnaEk7M5AahLKmhIOokqSZ8i5qWNiYn6GroZXu_p98.v33aVUaXHwezO19xrjdpoA";

const url = "https://staging.lief.care/api/graphql";
// const url = "http://localhost:4001/api/graphql";

const query1 = `
query home {
  homeDetails {
    id
    name
  }
}
`;

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

const stageCookie= `__Host-next-auth.csrf-token=34ccca5181e853beead247c2ba9276f5f785e02943537ae0b8ff027800ee9a39%7C7865e77c0d004359a0b2ce2de155892bf4e2fdd401d447fe1eca741a050a5746; __Secure-next-auth.callback-url=https%3A%2F%2Fstaging.lief.care%2F; cookieconsent_status=dismiss; __Secure-next-auth.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..31fwQSLEnQG6xVMF.LCSuKSdbAw544X5R8NDH46c-INNUUePxhlmvE3B1nAHQKTGR_wolVXECy-ASAcGDaFXX8eLEBD-YnWc2glXk0Gdn3n3csWbqXL6IADVmVw3QgFv4a4lSwAAk0GxWMFi0R8gX81zQZQS0pkOmtzy7DJNTiKLaUYLmZMo7sR2EMolag8gFwH1S0uKkLRpMNkJM6f2RQVVcgaQHjRltd7ksNM4w2D1Xtx52UvVBvYuyeuNQgYKOs8Iz2x6QmGXqap2g96_6LUALFXcqRtE6XXzELBVxx810lWeJdELkatBM4oUscfF8d0BTpNXB37oFYZW74O7GCK7ydPMMrA1Hw_ANC2j8dtiJcD4NehGa1p3HO-mgagxkjZmatTtJZ-nxyUjlfbI8TrBzgaaqAUR6MLkccYFuYFILfkyCD5e9lB0.wt9nznpYfOmvGjisp2m2Xg
`

const payload = JSON.stringify({
  query: query1,
});

const payload2 = JSON.stringify({
  query: query2,
});

const responseTrend = new Trend("response_time");

// The function that defines VU logic.
//
// See https://grafana.com/docs/k6/latest/examples/get-started-with-k6/ to learn more
// about authoring k6 scripts.
//
export default function () {
  // http.get('https://test.k6.io');

  const jar = http.cookieJar();


  for (const cookie of cookiestring.split(";")) {
    const [key, value] = cookie.split("=");
    jar.set(url, key, value);
  }


  // __Secure-next-auth.session
  // jar.set(url, "__Secure-next-auth.session", nexTauthCookie);
  // jar.set("https://httpbin.test.k6.io/cookies", "my_cookie", "hello world");

  // const cookies = {
  //   my_cookie: {
  //     value: "hello world 2",
  //     replace: true,
  //   },
  // };

  const res = http.post(url, payload, {
    // cookies,
    headers: {
      "Content-Type": "application/json",
      // Cookie: stageCookie,
      // 'next-auth.session-token': nexTauthCookie
    },
  });


  http.post(url, payload2, {
    // cookies,
    headers: {
      "Content-Type": "application/json",
      // 'next-auth.session-token': nexTauthCookie
    },
  });

  http.post(url, payload, {
    // cookies,
    headers: {
      "Content-Type": "application/json",
      // 'next-auth.session-token': nexTauthCookie
    },
  });

  http.post(url, payload, {
    // cookies,
    headers: {
      "Content-Type": "application/json",
      // 'next-auth.session-token': nexTauthCookie
    },
  });

  // responseTrend.add(res.timings.duration);

  // const json = res.json();
  // console.log(JSON.stringify(json, null, 2));


  // console.log({res})

  // if(res){
  //   const body = res.json();
  //   console.log({body})
  // }
  // const body = res.json();
  // console.log({body})
  check(res, {
    // "status is 200": (r) => r.status === 200,
    // "GET response time < 200ms": (r) => r.timings.duration < 200,
    "has cookies": (r) => {
      // console.log({ cook: r.cookies });
      return r.cookies !== null;
    },
    // "Get Users has no errors": (r) => !r.json().errors,
    // 'returns "data"': (r) => r.json().data,
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
