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
    columns = hash["table"]["cols"].map {|col| col["label"].strip}
    binding.pry
    rows = hash["table"]["rows"].map {|row| row["c"].map{|val| true_or_false(val.try(:[],"v"))}}
    binding.pry
    master_list = rows.map {|row| Hash[columns.zip row]}
    binding.pry
  end

  def true_or_false val
    if val && val.try(:downcase) == "y"
      return true
    elsif val && val.try(:downcase) == "n"
      return false
    else
      return val
    end
  end

end
