class MasterListController < ApplicationController

  def index
    render json: master_list
  end

  def master_list
    require 'open-uri'
    response = open('https://docs.google.com/spreadsheets/d/1oxGfROK6LVhK5U62lJydSL2YFybUEk-vmOD6Q-9NYnA/gviz/tq').read
    clean_response(response)
  end

  def clean_response response
    cleaned = JSON.parse(response[47..-3]) #remove callback function
    rearrange_scholarships(cleaned)
  end

  def rearrange_scholarships hash
    columns = hash["table"]["cols"].map {|col| col["label"].strip}
    rows = hash["table"]["rows"].map {|row| row["c"].map{|val| true_or_false(val.try(:[],"v"))}}
    master_list = rows.map {|row| Hash[columns.zip row]}
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
