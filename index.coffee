moment = require 'moment'
validator = require 'validator'

class Validator

    constructor: (fields) ->
        @setFields fields
        @errors = []

    toSnakeCase: (field) ->
        field.replace /([A-Z])/g, ($1) ->
            "_#{$1.toLowerCase()}"

    setFields: (fields) ->
        @fields = []
        for field, value of fields
            field = @toSnakeCase field
            @fields[field] = value

    setValues: (@values) ->

    getErrors: ->
        @errors

    checkRequired: (field) ->
        value = @values[field]
        unless value?
            @errors.push "Field '#{field}' is required."

    checkIsoDate: (field) ->
        value = @values[field]
        if value? and not moment(value).isValid()
            @errors.push "Field '#{field}' is not a valid ISO date."

    checkUrl: (field) ->
        value = @values[field]
        try
            validator.check(value).isUrl()
        catch e
            return "Field '#{field}' is not a valid URL."

    validate: ->
        for field, fieldRules of @fields
            if fieldRules is null
                continue
            unless Array.isArray fieldRules
                fieldRules = [fieldRules]

            for rule in fieldRules
                switch rule
                    when 'required' then @checkRequired field
                    when 'isoDate' then @checkIsoDate field
                    when 'url' then @checkUrl field

    isValid: ->
        @validate()
        @errors.length is 0

    getFilteredValues: ->
        params = Object.keys(@values)
        values = {}
        values[field] = @values[field] for field in params when @values[field]?
        values


module.exports = Validator
