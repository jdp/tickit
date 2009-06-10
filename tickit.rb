require 'rubygems'
require 'sinatra'
require 'haml'
require 'json'

COOKIE = "ticket_time"

get '/' do
  seconds = request.cookies[COOKIE].to_i
  seconds ||= 0
  hours = (seconds / (60 * 60)).floor
  seconds = seconds % (60 * 60)
  minutes = (seconds / 60).floor
  seconds = seconds % 60
  @total_time = "#{hours}h #{minutes}m #{seconds}s"
  haml :timer
end

get '/about' do
  haml :about
end

post '/log' do
  cookie = request.cookies[COOKIE]
  cookie ||= 0
  cookie = cookie.to_i
  cookie += params[:seconds].to_i
  response.set_cookie(COOKIE, cookie)
  {:total_time => cookie}.to_json
end

get '/new' do
  cookie = 0
  response.set_cookie(COOKIE, cookie)
  {:total_time => cookie}.to_json
  redirect '/'
end
