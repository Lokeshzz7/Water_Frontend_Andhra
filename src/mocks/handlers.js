import { http, HttpResponse } from 'msw'
 
export const handlers = [
  // Intercept "GET https://example.com/user" requests...
  http.get('https://www.gstatic.com/_/translate_http/_/ss/k=translate_http.tr.26tY-h6gH9w.L.W.O/am=DAY/d=0/rs=AN8SPfrCcgxoBri2FVMQptvuOBiOsolgBw/m=el_main_css', () => {
    return HttpResponse.json({
      message:"Fuck you google",
    })
  }),
]