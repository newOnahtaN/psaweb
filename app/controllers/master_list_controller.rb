class MasterListController < ApplicationController

  def index
    render json: master_list
  end

  def master_list
    require 'open-uri'
    response = open('https://spreadsheets.google.com/tq?key=1oxGfROK6LVhK5U62lJydSL2YFybUEk-vmOD6Q-9NYnA').read
    clean_response(response)
  end

  def clean_response response
    cleaned = JSON.parse(response[47..-3]) #remove callback function
    binding.pry
    rearrange_scholarships(cleaned) 
  end

  def rearrange_scholarships hash
    #insert your code here
    #Give two lists inside a bigger list
    #The first list should be all the Column Names that correspond the the column names on the google sheet here:
    #The second list should just the names of every single one of the scholarships
    # reference my code at https://github.com/newOnahtaN/psaweb/blob/master/app/controllers/master_list_controller.rb if you need help
  end

  # def true_or_false val
  #   if val && val.try(:downcase) == "y"
  #     return true
  #   elsif val && val.try(:downcase) == "n"
  #     return false
  #   else
  #     return val
  #   end
  # end

end
