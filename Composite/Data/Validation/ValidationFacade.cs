using System;
using Composite.Data;
using Composite.C1Console.Events;
using Microsoft.Practices.EnterpriseLibrary.Validation;


namespace Composite.Data.Validation
{
    /// <summary>    
    /// </summary>
    /// <exclude />
    [System.ComponentModel.EditorBrowsable(System.ComponentModel.EditorBrowsableState.Never)] 
    public static class ValidationFacade
    {
        private static IValidationFacade _implementation = new ValidationFacadeImpl();

        internal static IValidationFacade Implementation { get { return _implementation; } set { _implementation = value; } }



        /// <exclude />
        static ValidationFacade()
        {
            GlobalEventSystemFacade.SubscribeToFlushEvent(OnFlushEvent);
        }



        /// <exclude />
        public static ValidationResults Validate<T>(T data)
            where T : class, IData
        {
            return _implementation.Validate<T>(data);
        }



        // Overload
        /// <exclude />
        public static ValidationResults Validate(IData data)
        {
            return Validate(data.DataSourceId.InterfaceType, data);
        }



        /// <exclude />
        public static ValidationResults Validate(Type interfaceType, IData data)
        {
            return _implementation.Validate(interfaceType, data);
        }




        private static void OnFlushEvent(FlushEventArgs args)
        {
            _implementation.OnFlush();
        }
    }
}
