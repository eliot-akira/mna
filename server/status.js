
const status = {
  ok: 200,
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  error: 500,
  redirect: 302,
  redirectPermanent: 301
}

module.exports = status

/*
List of Common HTTP Status Codes

Status Code | Description | Meaning / Description of HTTP Status Codes

1XX HTTP Status codes – Provisional response

100 | Continue | This means that the server has received the request headers, and that the client should proceed to send the request body.
101 | Switching Protocols | This HTTP Status Code means the requester has asked the server to switch protocols and the server is admitting that it will do so.

2XX HTTP Status codes – Success

200 | OK | This code means action completed successfully. This is the Standard response for successful HTTP requests.
201 | Created | This status code means the request has been fulfilled and resulted in a new resource being created.
202 | Accepted | The request has been accepted for processing, but the processing has not been completed.
203 | Partial Information | Response to a GET command, indicates that the returned meta information is from a private overlaid web.
204 | No Content | This status code means the server successfully processed the request, but is not returning any content.
205 | Reset Content | This means the server successfully processed the request, but is not returning any content. Unlike a 204 response, this response requires that the requester reset the document view.
206 | Partial Content | The requested file was partially sent. Usually caused by stopping or refreshing a web page.

3XX HTTP Status codes – Redirect

300 | Multiple Choices | This status indicates multiple options for the resource that the client may follow.
301 | Moved Permanently | This request code is used for permanent URL redirection.
302 | Found |  The HTTP response status code 302 Found is a common way of performing URL redirection.
303 | See Other | The response to the request can be found under another URI using a GET method.
304 | Not Modified | The cached version of the requested file is the same as the file to be sent.
305 | Use Proxy |  The requested resource is only available through a proxy, whose address is provided in the response.

4XX HTTP Status codes – Request error

400 | Bad Request | The request had bad syntax or was impossible to be satisified.
401 | Unauthorized | User failed to provide a valid user name/password required to access the files/ directories.
402 | Payment Required | This code is reserved for future use.
403 | Forbidden | The request does not specify the file name. Or the directory or the file does not have the permission that allows the pages to be viewed from the web.
404 | Not Found | The requested file was not found.
405 | Method Not Allowed | Any wrong request method sent to the resource which is not supported by that resource. For example, using GET on a form which requires data to be presented via POST, or using PUT on a read-only resource.
406 | Not Acceptable | The requested resource is only capable of generating content not acceptable according to the Accept headers sent in the request.
407 | Proxy Authentication Required | The client must first authenticate itself with the proxy.
408 | Request Time-Out | This code indicates that the server timed out waiting for the request.
409 | Conflict | Indicates that the request could not be processed because of conflict in the request, such as an edit conflict in the case of multiple updates.
410 | Gone | This code means that the resource requested is no longer available and will not be available again.
411 | Length Required | The request did not specify the length of its content, which is required by the requested resource.
412 | Precondition Failed | The server does not meet one of the preconditions that the requester put on the request.
413 | Request Entity Too Large | The request is larger than the server is willing or able to process.
414 | Request-URL Too Large | The URI provided was too long for the server to process. Often the result of too much data being encoded as a query-string of a GET request, in which case it should be converted to a POST request.
415 | Unsupported Media Type | The request entity has a media type which the server or resource does not support.

5XX HTTP Status codes – Server error

500 | Internal Server Error | Usually, this error is a result of a problem with the code or program you are calling rather than with the web server itself.
501 | Not Implemented | The server does not support the facility required.
502 | Bad Gateway |  The server was acting as a gateway or proxy and received an invalid response from the upstream server.
503 | Out of Resources | The server cannot process the request due to a system overload.  This should be a temporary condition.
504 | Gateway Time-Out | The service did not respond within the time frame that the gateway was willing to wait.
505 | HTTP Version not supported |  The server does not support the HTTP protocol version used in the request.

*/