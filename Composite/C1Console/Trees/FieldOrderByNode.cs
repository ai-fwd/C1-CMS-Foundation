﻿using System;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using Composite.Core.Linq;
using Composite.Core.Types;


namespace Composite.C1Console.Trees
{
    internal sealed class FieldOrderByNode : OrderByNode
    {
        private PropertyInfo PropertyInfo { get; set; }


        public string FieldName { get; internal set; } // Required
        public string Direction { get; internal set; } // Optional


        public override Expression CreateOrderByExpression(Expression sourceExpression, ParameterExpression parameterExpression, bool first)
        {
            Expression fieldExpression = ExpressionHelper.CreatePropertyExpression(this.OwnerNode.InterfaceType, this.PropertyInfo.DeclaringType, this.FieldName, parameterExpression);

            LambdaExpression lambdaExpression = Expression.Lambda(fieldExpression, parameterExpression);

            if (first)
            {
                return this.Direction == "ascending"
                    ? ExpressionCreator.OrderBy(sourceExpression, lambdaExpression)
                    : ExpressionCreator.OrderByDescending(sourceExpression, lambdaExpression);
            }

            return this.Direction == "ascending"
                    ? ExpressionCreator.ThenBy(sourceExpression, lambdaExpression)
                    : ExpressionCreator.ThenByDescending(sourceExpression, lambdaExpression);
        }



        internal override void Initialize()
        {
            if ((this.Direction != "ascending") && (this.Direction != "descending"))
            {
                AddValidationError("TreeValidationError.FieldOrderBy.UnknownDirection", this.Direction);
            }

            this.PropertyInfo = this.OwnerNode.InterfaceType.GetPropertiesRecursively().SingleOrDefault(f => f.Name == this.FieldName);

            if (this.PropertyInfo == null)
            {
                AddValidationError("TreeValidationError.FieldOrderBy.UnknownField", this.OwnerNode.InterfaceType, this.FieldName);
            }
        }



        public override string ToString()
        {
            return string.Format("OrderByNode, FieldName = {0}, Direction = {1}", this.FieldName, this.Direction);
        }
    }
}
